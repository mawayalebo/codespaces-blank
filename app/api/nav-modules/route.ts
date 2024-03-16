import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import { NavModule } from '@/typings';

export async function GET(): Promise<NextResponse> {
  const navModules: NavModule[] = await scrapeTakealotNavModules();
  return NextResponse.json({ navModules });
}

async function scrapeTakealotNavModules(): Promise<NavModule[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigating to takealot.com 
    await page.goto('https://www.takealot.com', { timeout: 1200000 });

    const navModules = await page.$$eval('.swiper-slide.navigation-bar-module_item_1pyly', (moduleElements: Element[]) => {
      return moduleElements.map((moduleElement: Element) => {
        const anchor = moduleElement.querySelector('a');
        const title = anchor?.textContent || '';
        const href = (anchor as HTMLAnchorElement).getAttribute('href') || '';
        const id = (anchor as HTMLAnchorElement).getAttribute('id') || '';

        // Extract the entire style tag element
        const styleElement = moduleElement.querySelector('style');
        const styleText = styleElement?.outerHTML || '';

        return {
          title,
          href,
          styleElement: styleText,
          id,
        };
      });
    });

    return navModules;
  } catch (error) {
    console.error('Error while scraping:', error);
    return [];
  } finally {
    await browser.close();
  }
}