import { NextResponse } from "@/next/server"

export type Departments = NextResponse<[String]>

export interface Department {
    titile: String
}

 export interface Advert{
    adURL: string | null;
}

interface Catalog {
    title: string;
    products: [Product]
  }
  
interface Product {
      productTitle: String,
      price:{
        now: String | null,
        list: String | null
      },
      productThumbLink: String | null,
      rating: String | null,
      raters: String | null,
      saleImg: String | null,
      salePercentage: String | null,
}


interface FeaturedBrand {
    imgURL: string;
}

interface NavModule {
    title: string;
    href: string;
    styleElement: string;
    id: string;
}
  