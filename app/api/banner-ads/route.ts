import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import { Advert } from "@/typings.d";


export async function GET(): Promise<NextResponse> {
  const bannerAds: Advert[] = await scrapeTakealotBannerAds();
  return NextResponse.json({ bannerAds });
}

async function scrapeTakealotBannerAds(): Promise<Advert[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigating to takealot.com to get featured brands
    await page.goto('https://www.takealot.com', { timeout: 1200000 });

    // Waiting for the banner-slide to load
    await page.waitForSelector('.banner-slide', { visible: true });

    const adverts: Advert[] = [];

    // Getting the iframes inside .banner-slide
    const iframes = await page.$$('.banner-slide iframe');

    for (const iframe of iframes) {
      const frame = await iframe.contentFrame();
      if (frame) {
        const imgElement = await frame.$('img.adunit-image');
        if (imgElement) {
          const adURL = (await imgElement.evaluate((element) =>
            element.getAttribute('src')
          )) as string;
          adverts.push({
            adURL,
          });
        }
      }
    }

    return adverts;
  } catch (error) {
    console.error('Error while scraping:', error);
    return []
  } finally {
    await browser.close();
  }
}