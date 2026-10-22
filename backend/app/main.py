from fastapi import FastAPI

app = FastAPI(title="Inkeeper API")

@app.get("/health")
def health():
    return { "status":"okay"}
