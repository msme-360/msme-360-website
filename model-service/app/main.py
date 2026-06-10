from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.api_router_v1 import api_v1_router
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = FastAPI(
    title="MSME 360 ML Microservice",
    description="High-performance Python ML Microservice for forecasting",
    version="1.0.0"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the grouped V1 router
app.include_router(api_v1_router)

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
def root_home() -> str:
    return """
<!doctype html>
<html lang="en">
<head>
    <link rel="icon" type="image/png" href="https://supabase.com" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ML Forecasting Model Service</title>
    <style>
        :root {
            --bg1: #fafafa;
            --bg2: #f0fdf4; /* Light green tint representing forecasting growth */
            --ink: #0f172a;
            --muted: #475569;
            --accent: #16a34a; /* Success/Growth Green for forecasting */
            --card: #ffffff;
            --border: #e2e8f0;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            color: var(--ink);
            background:
                radial-gradient(circle at 10% 10%, #ffffff 0%, transparent 35%),
                radial-gradient(circle at 90% 80%, #dcfce7 0%, transparent 30%),
                linear-gradient(135deg, var(--bg1), var(--bg2));
            display: grid;
            place-items: center;
            padding: 24px;
        }
        .card {
            width: min(680px, 100%);
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 38px 30px;
            box-shadow: 0 12px 40px rgba(15, 23, 42, 0.06);
        }
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #dcfce7;
            color: #15803d;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 16px;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            background: var(--accent);
            border-radius: 50%;
            animation: pulse 1.8s infinite;
        }
        h1 {
            margin: 0 0 10px;
            font-size: clamp(1.55rem, 2.2vw, 2.05rem);
            letter-spacing: -0.3px;
        }
        p {
            margin: 8px 0;
            color: var(--muted);
            line-height: 1.6;
        }
        .links {
            margin-top: 24px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        a {
            text-decoration: none;
            color: #166534;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            padding: 10px 16px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.95rem;
            transition: transform 0.12s ease, background 0.12s ease;
        }
        a:hover {
            background: #dcfce7;
            transform: translateY(-1px);
        }
        .hint {
            margin-top: 24px;
            font-size: 0.88rem;
            border-top: 1px dashed var(--border);
            padding-top: 16px;
        }
        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
        }
    </style>
</head>
<body>
    <main class="card">
        <div class="status-badge">
            <span class="status-dot"></span> Active
        </div>
        <h1>ML Forecasting Service Engine</h1>
        <p>This is the isolated Python microservice responsible for demand forecasting.</p>
        <div class="links">
            <a href="/docs">Interactive Swagger Docs</a>
            <a href="/redoc">Alternative ReDoc</a>
        </div>
        <p class="hint">This root index landing template ensures public entry calls return a clean interface rather than standard 404 handler states.</p>
    </main>
</body>
</html>
    """

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "model-service"}