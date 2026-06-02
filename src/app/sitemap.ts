import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fortunavita.com.br",
    },
    {
      url: "https://fortunavita.com.br/consultoria",
    },
    {
      url: "https://fortunavita.com.br/planejamento",
    },
    {
      url: "https://fortunavita.com.br/investimentos",
    },
    {
      url: "https://fortunavita.com.br/login",
    },
  ];
}
