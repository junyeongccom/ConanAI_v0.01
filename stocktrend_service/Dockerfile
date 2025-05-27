FROM python:3.11.9-slim

WORKDIR /app

# Install system dependencies and Chrome
RUN apt-get update \
    && apt-get install -y \
        wget \
        unzip \
        curl \
        gnupg \
        libnss3 \
        libgconf-2-4 \
        libxi6 \
        libxcursor1 \
        libxcomposite1 \
        libasound2 \
        libxtst6 \
        libxrandr2 \
        libxdamage1 \
        libgbm1 \
        libgtk-3-0 \
    && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt install -y ./google-chrome-stable_current_amd64.deb \
    && rm google-chrome-stable_current_amd64.deb \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt \
    && rm -rf /root/.cache/pip

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8081", "--reload"]