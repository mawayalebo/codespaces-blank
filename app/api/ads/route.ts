import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import { Advert } from "@/typings.d"

export async function GET(): Promise<NextResponse> {
  const ads: Advert[] = await scrapeTakealotAds();
  return NextResponse.json({ ads });
}

async function scrapeTakealotAds(): Promise<Advert[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigating to takealot.com to get featured brands
    await page.goto('https://www.takealot.com', { timeout: 1200000 });

    const iframes = await page.$$('iframe[title="3rd party ad content"]');
    const adverts: Advert[] = [];

    for (const iframe of iframes) {
      const frame = await iframe.contentFrame();
      if (frame) {
        const imgElement = await frame.$('img.adunit-image');
        if (imgElement) {
          const adURL = await imgElement.evaluate((element) => element.getAttribute('src'));
          adverts.push({
            adURL,
          });
        }
      }
    }

    return adverts;
  } catch (error) {
    console.error('Error while scraping:', error);
    return [];
  } finally {
    await browser.close();
  }
}