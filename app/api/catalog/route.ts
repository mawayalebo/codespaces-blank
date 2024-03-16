import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import { Catalog } from '@/typings';


export async function GET(): Promise<NextResponse> {
  
  const catalog: Catalog[] = await scrapeTakealotCatalog(startIndex, endIndex);
  return NextResponse.json({ catalog });
}

//incrementing indexing
let startIndex = 0;
let endIndex = 10;

async function scrapeTakealotCatalog(startIndex: number, endIndex: number): Promise<Catalog[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
 
  try {
    // Navigate to takealot.com or specific category page
    await page.goto('https://www.takealot.com', { timeout: 1200000 });
    
    const catalog = await page.$$eval('.product-strip-title', (titleElements: any, startIndex: number, endIndex: number) =>
      titleElements.map((titleElement: any) => {
        const title = titleElement.querySelector('h2').innerText; 
        
        const products = Array.from(
          document.querySelectorAll('.product-card')
        ).slice(startIndex, endIndex).map((productElement: any) => {
          const productTitle = productElement.querySelector('.card-section a h4.product-title')?.innerText || null;
          const productThumbLink = productElement.querySelector('.card-section .product-thumb-container .product-thumb-wrapper a div.image-box.product-thumb img')?.getAttribute('src') || '';
          const now = productElement.querySelector('.card-section ul li.price span')?.innerText || null;
          const list = productElement.querySelector('.card-section ul li.list-price span')?.innerText || null;
          const rating = productElement.querySelector('.card-section .rating div')?.innerText || null;
          const raters = productElement.querySelector('.card-section .rating div span')?.innerText || null;
          const saleImg = productElement.querySelector('ul.badge-list li div.badge.image.small img')?.getAttribute('src') || null;
          const salePercentage = productElement.querySelector('ul.badge-list li div.badge.saving.small span')?.innerText || null;
          return {
            productTitle,
            price:{
              now,
              list
            },
            productThumbLink,
            rating,
            raters,
            saleImg,
            salePercentage,
          };
        });
        startIndex += 10
        endIndex += 9
        return {
          title,
          products,
        };
      }), startIndex, endIndex);

    return catalog;
  } catch (error) {
    console.error('Error while scraping:', error);
    return [];
  } finally {
    await browser.close();
  }
}