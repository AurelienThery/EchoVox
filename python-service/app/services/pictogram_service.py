import httpx
from typing import List, Dict


class PictogramService:
    """Service for fetching pictograms from ARASAAC API"""
    
    ARASAAC_API_BASE = "https://api.arasaac.org/api"
    
    async def fetch_pictograms(self, keywords: List[str], locale: str = "en") -> List[Dict]:
        """
        Fetch pictograms from ARASAAC API for given keywords
        
        Args:
            keywords: List of keywords to search pictograms for
            locale: Language locale (e.g., 'en', 'fr', 'es')
        
        Returns:
            List of pictogram data with URLs and metadata
        """
        pictograms = []
        
        async with httpx.AsyncClient() as client:
            for keyword in keywords:
                try:
                    # Search for pictogram by keyword
                    search_url = f"{self.ARASAAC_API_BASE}/pictograms/{locale}/search/{keyword}"
                    response = await client.get(search_url, timeout=10.0)
                    
                    if response.status_code == 200:
                        results = response.json()
                        
                        # Get the first result (most relevant)
                        if results and len(results) > 0:
                            pictogram = results[0]
                            picto_id = pictogram.get('_id')
                            
                            pictograms.append({
                                'keyword': keyword,
                                'id': picto_id,
                                'url': f"{self.ARASAAC_API_BASE}/pictograms/{picto_id}",
                                'text': pictogram.get('keywords', [{}])[0].get('keyword', keyword) if pictogram.get('keywords') else keyword
                            })
                except Exception as e:
                    print(f"Error fetching pictogram for '{keyword}': {e}")
                    continue
        
        return pictograms
    
    async def get_pictogram_by_id(self, picto_id: int, locale: str = "en") -> Dict:
        """Get specific pictogram by ID"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.ARASAAC_API_BASE}/pictograms/{locale}/{picto_id}"
                response = await client.get(url, timeout=10.0)
                
                if response.status_code == 200:
                    return response.json()
        except Exception as e:
            print(f"Error fetching pictogram {picto_id}: {e}")
        
        return {}
