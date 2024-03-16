import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import { FeaturedBrand } from '@/typings';


export async function GET(): Promise<NextResponse> {
  const featuredBrands: FeaturedBrand[] = await scrapeTakealotFeaturedBrands();
  return NextResponse.json({ featuredBrands });
}

async function scrapeTakealotFeaturedBrands(): Promise<FeaturedBrand[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigating to takealot.com to get featured brands
    await page.goto('https://www.takealot.com', { timeout: 1200000 });

    const featuredBrands = await page.$$eval('.brand-logo-link', (brands: any) =>
      brands.map((brand: any) => {
        const imgURL = brand.querySelector('div img').src;
        
        return {
          imgURL
        };
      })
    );

    return featuredBrands;
  } catch (error) {
    console.error('Error while scraping:', error);
    return [];
  } finally {
    await browser.close();
  }
}