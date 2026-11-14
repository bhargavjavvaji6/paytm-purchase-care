import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI(title="Paytm Purchase Care API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Database
purchases_db = [
    {
        "id": "1",
        "merchant": "Reliance Digital",
        "product_name": "Samsung Galaxy S24",
        "category": "electronics",
        "purchase_date": "2026-10-12",
        "expiry_date": "2027-10-12",
        "status": "Active"
    }
]

class VoiceRequest(BaseModel):
    text: str
    target_language: str = "hi-IN"

class RealtimePurchase(BaseModel):
    merchant: str
    product_name: str
    category: str

@app.get("/api/purchases")
def get_purchases():
    return purchases_db

@app.post("/api/scan-invoice")
async def scan_invoice(file: UploadFile = File(...), merchant: str = "Unknown", product_name: str = "Unknown", category: str = "electronics"):
    """Handles invoice upload immediately after a real-time Paytm payment"""
    today = datetime.now()
    
    if category == "groceries":
        expiry = today + timedelta(days=3) # Groceries expire quickly
    else:
        expiry = today + timedelta(days=30) # Simulating an upcoming warranty expiry for testing
        
    new_item = {
        "id": str(len(purchases_db) + 1),
        "merchant": merchant if merchant != "Unknown" else "Paytm Merchant",
        "product_name": product_name if product_name != "Unknown" else "Smart TV",
        "category": category,
        "purchase_date": today.strftime("%Y-%m-%d"),
        "expiry_date": expiry.strftime("%Y-%m-%d"),
        "status": "Active"
    }
    purchases_db.insert(0, new_item)
    return {"status": "success", "extracted_data": new_item}

@app.get("/api/check-expirations")
def check_expirations():
    """Checks for expiring items and returns a voice script for Sarvam AI"""
    if not purchases_db:
        return {"status": "no_alerts"}
        
    # Check the most recently added item for demonstration
    latest_item = purchases_db[0]
    
    if latest_item["category"] == "electronics":
        script = f"नमस्ते। आपके {latest_item['product_name']} की वारंटी जल्द ही समाप्त हो रही है। कृपया पेटीएम केयर हब से इसे रिन्यू करें।"
    else:
        script = f"नमस्ते। आपने जो {latest_item['product_name']} खरीदा था, वह जल्द ही एक्सपायर होने वाला है। कृपया इसे समय पर इस्तेमाल करें।"
        
    return {"status": "alert_found", "item": latest_item, "voice_script": script}

@app.post("/api/voice-agent")
async def trigger_voice_agent(request: VoiceRequest):
    api_key = os.getenv("SARVAM_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Sarvam API Key missing")
    
    url = "https://api.sarvam.ai/text-to-speech"
    headers = {"api-subscription-key": api_key, "Content-Type": "application/json"}
    payload = {
        "inputs": [request.text],
        "target_language_code": request.target_language,
        "speaker": "meera",
        "pitch": 0, "pace": 1.0, "loudness": 1.5,
        "speech_sample_rate": 8000, "enable_preprocessing": True, "model": "auras-tts"
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return {"audio_base64": response.json().get("audios")[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)