import os
from typing import List
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI


class TextSimplifier:
    """Service for simplifying text to FALC (Facile À Lire et à Comprendre) format using LangChain"""
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        
        # If no API key, use mock simplification
        if not api_key:
            self.llm = None
        else:
            self.llm = ChatOpenAI(
                temperature=0.3,
                model_name="gpt-3.5-turbo",
                openai_api_key=api_key
            )
        
        # FALC simplification prompt
        self.simplification_template = """You are an expert in simplifying text following FALC (Facile À Lire et à Comprendre) guidelines.

FALC rules:
- Use short, simple sentences
- Use common, everyday words
- Avoid jargon and complex terms
- Use active voice
- One idea per sentence
- Use concrete examples

Original text: {text}

Please simplify this text following FALC guidelines:"""
        
        # Keyword extraction prompt
        self.keyword_template = """Extract 5-8 key nouns and verbs from this text that could be represented with pictograms.
Return only the keywords separated by commas.

Text: {text}

Keywords:"""
    
    async def simplify(self, text: str) -> str:
        """Simplify text to FALC format"""
        if not self.llm:
            # Mock simplification when no API key
            return self._mock_simplify(text)
        
        try:
            prompt = PromptTemplate(
                input_variables=["text"],
                template=self.simplification_template
            )
            
            chain = LLMChain(llm=self.llm, prompt=prompt)
            result = await chain.arun(text=text)
            
            return result.strip()
        except Exception as e:
            print(f"Error in simplification: {e}")
            return self._mock_simplify(text)
    
    async def extract_keywords(self, text: str) -> List[str]:
        """Extract keywords for pictogram search"""
        if not self.llm:
            return self._mock_keywords(text)
        
        try:
            prompt = PromptTemplate(
                input_variables=["text"],
                template=self.keyword_template
            )
            
            chain = LLMChain(llm=self.llm, prompt=prompt)
            result = await chain.arun(text=text)
            
            keywords = [k.strip() for k in result.split(",") if k.strip()]
            return keywords[:8]  # Limit to 8 keywords
        except Exception as e:
            print(f"Error in keyword extraction: {e}")
            return self._mock_keywords(text)
    
    def _mock_simplify(self, text: str) -> str:
        """Simple mock simplification when no LLM available"""
        # Basic simplification: split long sentences, remove complex punctuation
        sentences = text.replace(";", ".").replace(":", ".").split(".")
        simplified = ". ".join(s.strip() for s in sentences if s.strip())
        return simplified + "."
    
    def _mock_keywords(self, text: str) -> List[str]:
        """Extract basic keywords without LLM"""
        # Simple word extraction: get longer words that might be nouns
        words = text.lower().split()
        # Filter common words and keep substantive ones
        stop_words = {'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'à', 'au', 
                     'the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for'}
        keywords = [w.strip('.,;:!?') for w in words if len(w) > 4 and w.lower() not in stop_words]
        return keywords[:8]
