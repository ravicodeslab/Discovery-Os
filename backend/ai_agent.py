import json
import logging
from typing import Optional
from config import settings

logger = logging.getLogger(__name__)

# Mock analysis function - replace with actual Groq client when API key available
def analyze_transcript(content: str) -> Optional[dict]:
    """
    Analyze transcript using Groq API or fallback to mock data
    """
    try:
        # Try to use Groq API if available
        if settings.groq_api_key:
            from groq import Groq
            client = Groq(api_key=settings.groq_api_key)
            
            prompt = f"""You are a Product Insights Expert analyzing user research.

Analyze this transcript and extract:
1. PAIN POINTS: What problems or frustrations does the user mention?
2. USER SEGMENTS: Who is this user? What role/company size/industry?
3. THEMES: What recurring topics come up?
4. RECOMMENDATIONS: What features or improvements would address these pain points?

TRANSCRIPT:
{content}

Respond ONLY with valid JSON in this exact format:
{{
  "pain_points": [
    {{
      "title": "string (short title)",
      "description": "string",
      "frequency": 1,
      "impact": "HIGH|MEDIUM|LOW",
      "supporting_quote": "direct quote from transcript"
    }}
  ],
  "user_segments": [
    {{
      "name": "string",
      "role": "string",
      "company_size": "string",
      "characteristics": "string"
    }}
  ],
  "themes": [
    {{
      "name": "string",
      "description": "string",
      "frequency": 1,
      "related_to_pain_points": ["title1", "title2"]
    }}
  ],
  "recommendations": [
    {{
      "title": "string",
      "description": "string",
      "addresses": ["pain_point_title"],
      "effort": "HIGH|MEDIUM|LOW",
      "impact": "HIGH|MEDIUM|LOW",
      "priority_score": 85
    }}
  ]
}}"""
            
            response = client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=2000,
            )
            
            response_text = response.choices[0].message.content
            return json.loads(response_text)
    except Exception as e:
        logger.error(f"Error calling Groq API: {e}")
    
    # Fallback to mock data
    return get_mock_insights()

def get_mock_insights() -> dict:
    """
    Return mock insights for demo purposes
    """
    return {
        "pain_points": [
            {
                "title": "Complex Onboarding Process",
                "description": "New users struggle with the initial setup and configuration steps.",
                "frequency": 5,
                "impact": "HIGH",
                "supporting_quote": "The onboarding took me 2 hours, I almost gave up",
            },
            {
                "title": "Unclear Documentation",
                "description": "Documentation is outdated and doesn't cover common use cases.",
                "frequency": 4,
                "impact": "HIGH",
                "supporting_quote": "The docs don't match the actual product",
            },
            {
                "title": "Limited Integration Options",
                "description": "Users want more third-party integrations and API capabilities.",
                "frequency": 3,
                "impact": "MEDIUM",
                "supporting_quote": "We can't integrate with our existing tools",
            },
            {
                "title": "Performance Issues at Scale",
                "description": "Product slows down significantly with large datasets.",
                "frequency": 3,
                "impact": "HIGH",
                "supporting_quote": "It becomes unusable with more than 10k records",
            },
            {
                "title": "Lack of Advanced Filtering",
                "description": "Users need more granular filtering and search capabilities.",
                "frequency": 2,
                "impact": "MEDIUM",
            },
        ],
        "user_segments": [
            {
                "name": "Enterprise Teams",
                "role": "Product Manager",
                "company_size": "500+ employees",
                "characteristics": "Large organizations requiring compliance, integrations, and dedicated support",
            },
            {
                "name": "Startup Founders",
                "role": "Founder/CEO",
                "company_size": "<50 employees",
                "characteristics": "Cost-conscious, needs quick setup, wants all-in-one solution",
            },
            {
                "name": "Mid-Market Companies",
                "role": "Operations Manager",
                "company_size": "50-200 employees",
                "characteristics": "Balanced needs between features and price, growing team",
            },
        ],
        "themes": [
            {
                "name": "User Experience & Usability",
                "description": "Overall experience is complex and could be simplified",
                "frequency": 8,
                "related_to_pain_points": ["Complex Onboarding Process", "Unclear Documentation"],
            },
            {
                "name": "Integration & Extensibility",
                "description": "Users want better connectivity with other tools",
                "frequency": 6,
                "related_to_pain_points": ["Limited Integration Options"],
            },
            {
                "name": "Performance & Scalability",
                "description": "System needs optimization for larger data volumes",
                "frequency": 5,
                "related_to_pain_points": ["Performance Issues at Scale"],
            },
            {
                "name": "Data Management & Filtering",
                "description": "Need more powerful search and filter capabilities",
                "frequency": 4,
                "related_to_pain_points": ["Lack of Advanced Filtering"],
            },
        ],
        "recommendations": [
            {
                "title": "Redesign Onboarding Flow",
                "description": "Create an interactive guided tour with real-world examples",
                "addresses": ["Complex Onboarding Process"],
                "effort": "MEDIUM",
                "impact": "HIGH",
                "priority_score": 95,
            },
            {
                "title": "Build Zapier Integration",
                "description": "Connect with Zapier to enable 3000+ app integrations",
                "addresses": ["Limited Integration Options"],
                "effort": "HIGH",
                "impact": "HIGH",
                "priority_score": 88,
            },
            {
                "title": "Revamp Documentation",
                "description": "Rebuild docs with video tutorials and interactive examples",
                "addresses": ["Unclear Documentation"],
                "effort": "MEDIUM",
                "impact": "HIGH",
                "priority_score": 87,
            },
            {
                "title": "Implement Advanced Search",
                "description": "Add full-text search, filters, and saved searches",
                "addresses": ["Lack of Advanced Filtering"],
                "effort": "MEDIUM",
                "impact": "MEDIUM",
                "priority_score": 72,
            },
            {
                "title": "Database Optimization",
                "description": "Optimize queries, add caching, consider database indexing",
                "addresses": ["Performance Issues at Scale"],
                "effort": "HIGH",
                "impact": "HIGH",
                "priority_score": 85,
            },
            {
                "title": "Add API Documentation",
                "description": "Publish comprehensive API docs and SDKs",
                "addresses": ["Limited Integration Options"],
                "effort": "LOW",
                "impact": "MEDIUM",
                "priority_score": 68,
            },
        ],
    }
