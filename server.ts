import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper to get NEIS key (from request header/query or env)
function getNeisKey(req: Request): string {
  const customKey = (req.headers['x-neis-key'] as string) || (req.query.key as string);
  if (customKey && customKey.trim().length > 0) {
    return customKey.trim();
  }
  return process.env.NEIS_API_KEY?.trim() || '';
}

// 1. School Search Proxy Endpoint
app.get('/api/neis/school', async (req: Request, res: Response) => {
  try {
    const schoolName = (req.query.name as string || '').trim();
    const regionCode = (req.query.regionCode as string || '').trim();
    const pageIndex = Number(req.query.pIndex) || 1;
    const pageSize = Number(req.query.pSize) || 20;
    const apiKey = getNeisKey(req);

    if (!schoolName) {
      return res.status(400).json({ error: '학교명을 입력해주세요.' });
    }

    const params = new URLSearchParams({
      Type: 'json',
      pIndex: String(pageIndex),
      pSize: String(pageSize),
      SCHUL_NM: schoolName,
    });

    if (apiKey) {
      params.append('KEY', apiKey);
    }
    if (regionCode) {
      params.append('ATPT_OFCDC_SC_CODE', regionCode);
    }

    const targetUrl = `https://open.neis.go.kr/hub/schoolInfo?${params.toString()}`;
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: `NEIS API 응답 오류: ${response.statusText}`,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error('School search proxy error:', error);
    return res.status(500).json({ error: '학교 정보를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 2. Meal Service Info Proxy Endpoint
app.get('/api/neis/meal', async (req: Request, res: Response) => {
  try {
    const officeCode = (req.query.officeCode as string || '').trim();
    const schoolCode = (req.query.schoolCode as string || '').trim();
    const date = (req.query.date as string || '').trim(); // YYYYMMDD
    const fromDate = (req.query.fromDate as string || '').trim();
    const toDate = (req.query.toDate as string || '').trim();
    const mealCode = (req.query.mealCode as string || '').trim(); // 1, 2, 3
    const pageIndex = Number(req.query.pIndex) || 1;
    const pageSize = Number(req.query.pSize) || 100;
    const apiKey = getNeisKey(req);

    if (!officeCode || !schoolCode) {
      return res.status(400).json({ error: '교육청 코드와 학교 코드가 필요합니다.' });
    }

    const params = new URLSearchParams({
      Type: 'json',
      pIndex: String(pageIndex),
      pSize: String(pageSize),
      ATPT_OFCDC_SC_CODE: officeCode,
      SD_SCHUL_CODE: schoolCode,
    });

    if (apiKey) {
      params.append('KEY', apiKey);
    }

    if (date) {
      params.append('MLSV_YMD', date);
    } else if (fromDate && toDate) {
      params.append('MLSV_FROM_YMD', fromDate);
      params.append('MLSV_TO_YMD', toDate);
    }

    if (mealCode) {
      params.append('MMEAL_SC_CODE', mealCode);
    }

    const targetUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?${params.toString()}`;
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `NEIS API 응답 오류: ${response.statusText}`,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Meal search proxy error:', error);
    return res.status(500).json({ error: '급식 정보를 불러오는 중 오류가 발생했습니다.' });
  }
});

// 3. Health & API Key verification endpoint
app.get('/api/neis/verify-key', async (req: Request, res: Response) => {
  try {
    const apiKey = getNeisKey(req);
    const params = new URLSearchParams({
      Type: 'json',
      pIndex: '1',
      pSize: '1',
      SCHUL_NM: '서울고등학교',
    });
    if (apiKey) {
      params.append('KEY', apiKey);
    }

    const targetUrl = `https://open.neis.go.kr/hub/schoolInfo?${params.toString()}`;
    const response = await fetch(targetUrl);
    const data = await response.json();

    if (data.RESULT && data.RESULT.CODE && data.RESULT.CODE.startsWith('ERROR')) {
      return res.json({
        valid: false,
        code: data.RESULT.CODE,
        message: data.RESULT.MESSAGE || '인증키가 유효하지 않습니다.',
      });
    }

    return res.json({
      valid: true,
      hasKey: Boolean(apiKey),
      message: apiKey ? '나이스 API 키가 정상 인증되었습니다!' : '공개 기본 모드로 정상 연결되었습니다.',
    });
  } catch (err: any) {
    return res.status(500).json({ valid: false, error: err.message });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`급식급식 Server is ready on http://0.0.0.0:${PORT}`);
  });
}

startServer();
