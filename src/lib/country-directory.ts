export type VisaCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  pivot?: {
    availability_note?: string | null;
    application_method?: string | null;
  };
};

export type CountryService = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  pivot?: {
    is_featured?: boolean;
    sort_order?: number;
    description?: string | null;
  };
};

export type Country = {
  id: number;
  name: string;
  slug: string;
  iso2: string;
  iso3?: string | null;
  flag_emoji?: string | null;
  capital?: string | null;
  short_description?: string | null;
  overview?: string | null;
  visa_information?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  visa_categories: VisaCategory[];
  services: CountryService[];
};

export type CountryListResponse = {
  success: boolean;
  data: Country[];
  meta: {
    total: number;
    filters: {
      categories: Pick<VisaCategory, "name" | "slug">[];
      services: Pick<CountryService, "name" | "slug">[];
    };
  };
};

type CountryResponse = {
  success: boolean;
  data: Country;
};

function getApiUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\\/+$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return baseUrl;
}

function emptyCountryDirectory(): CountryListResponse {
  return {
    success: false,
    data: [],
    meta: {
      total: 0,
      filters: {
        categories: [],
        services: [],
      },
    },
  };
}

export async function getCountryDirectory(): Promise<CountryListResponse> {
  try {
    const response = await fetch(`${getApiUrl()}/countries`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Country directory API returned HTTP ${response.status}.`);
      return emptyCountryDirectory();
    }

    const payload = (await response.json()) as CountryListResponse;

    if (!payload || !Array.isArray(payload.data)) {
      console.error("Country directory API returned an invalid response.");
      return emptyCountryDirectory();
    }

    return payload;
  } catch (error) {
    console.error("Country directory could not be loaded:", error);
    return emptyCountryDirectory();
  }
}

export async function getCountry(slug: string): Promise<Country> {
  const response = await fetch(
    `${getApiUrl()}/countries/${encodeURIComponent(slug)}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    throw new Error("COUNTRY_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error(`Country API returned ${response.status}.`);
  }

  const payload = (await response.json()) as CountryResponse;

  if (!payload?.data) {
    throw new Error("Invalid country API response.");
  }

  return payload.data;
}
