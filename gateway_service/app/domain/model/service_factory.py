import httpx
from app.domain.model.service_type import ServiceType, SERVICE_URLS

class ServiceProxyFactory:
    """서비스 프록시 팩토리 클래스"""
    
    def __init__(self, service_type: ServiceType):
        self.service_type = service_type
        self.base_url = SERVICE_URLS.get(service_type)
        if not self.base_url:
            raise ValueError(f"서비스 {service_type}에 대한 기본 URL이 구성되지 않았습니다.")
    
    async def request(self, method: str, path: str, headers=None, body=None, files=None, params=None, data=None, timeout=30):
        """지정된 서비스에 요청을 전달합니다."""
        url = f"{self.base_url}/{path}"
        
        # 헤더 처리
        clean_headers = {}
        if headers:
            for name, value in headers:
                if name.decode().lower() not in ['host', 'content-length']:
                    clean_headers[name.decode()] = value.decode()
        
        async with httpx.AsyncClient(timeout=timeout) as client:
            try:
                response = await client.request(
                    method=method,
                    url=url,
                    headers=clean_headers,
                    content=body,
                    files=files,
                    params=params,
                    data=data
                )
                return response
            except Exception as e:
                # 예외 발생 시 에러 응답 반환
                error_response = httpx.Response(
                    status_code=500,
                    content=f"서비스 요청 중 오류 발생: {str(e)}".encode()
                )
                return error_response
