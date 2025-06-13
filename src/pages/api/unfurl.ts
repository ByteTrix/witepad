import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {    // Simple metadata extractor - in production you might want to use a dedicated service
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Witepad/1.0',
      },
    });

    if (!response.ok) {
      return res.status(404).json({ error: 'Could not fetch URL' });
    }

    const html = await response.text();
    
    // Extract metadata from HTML
    const title = extractMetaTag(html, 'title') || 
                 extractMetaTag(html, 'og:title') || 
                 extractHtmlTag(html, 'title') || 
                 url;
    
    const description = extractMetaTag(html, 'description') || 
                       extractMetaTag(html, 'og:description') || 
                       '';
    
    const image = extractMetaTag(html, 'og:image') || '';
    
    // Try to find favicon
    const faviconLink = extractHtmlAttribute(html, 'link', 'rel', 'icon', 'href') ||
                      extractHtmlAttribute(html, 'link', 'rel', 'shortcut icon', 'href');
    
    const favicon = faviconLink ? 
                   (faviconLink.startsWith('http') ? faviconLink : new URL(faviconLink, new URL(url).origin).toString()) : 
                   new URL('/favicon.ico', new URL(url).origin).toString();
    
    return res.status(200).json({
      title,
      description,
      image,
      favicon,
      url
    });
  } catch (error) {
    console.error('Error unfurling URL:', error);
    return res.status(500).json({ 
      error: 'Failed to unfurl URL',
      title: url,
      description: '',
      image: '',
      favicon: '',
      url
    });
  }
}

// Helper functions to extract metadata
function extractMetaTag(html: string, name: string): string | null {
  const regexName = new RegExp(`<meta\\s+(?:name|property)=["']${name}["']\\s+content=["']([^"']+)["']`, 'i');
  const regexProperty = new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+(?:name|property)=["']${name}["']`, 'i');
  
  const matchName = html.match(regexName);
  if (matchName && matchName[1]) return matchName[1];
  
  const matchProperty = html.match(regexProperty);
  if (matchProperty && matchProperty[1]) return matchProperty[1];
  
  return null;
}

function extractHtmlTag(html: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

function extractHtmlAttribute(
  html: string, 
  tag: string, 
  attributeName: string, 
  attributeValue: string, 
  extractAttribute: string
): string | null {
  const regex = new RegExp(`<${tag}[^>]*${attributeName}=["']${attributeValue}["'][^>]*${extractAttribute}=["']([^"']+)["'][^>]*>`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}
