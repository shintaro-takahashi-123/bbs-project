export interface WorkItem {
  id: string | number;
  title: string;
  category: "Career" | "Qualification" | "Workflow" | "others" | "All";
  subcategory: string;
  date?: string;
  description?: string;
  image?: string;
  link?: string;
}

export interface CMSWorkItem {
  id: string;
  title: string;
  category: "Career" | "Qualification" | "Workflow" | "others" | "All";
  subcategory: string;
  date?: string;
  description?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
  } | string;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CMSResponse {
  contents: CMSWorkItem[];
  totalCount: number;
  offset: number;
  limit: number;
}

// Fallback mock data themed around Shintaro Takahashi's career, security qualifications, and consulting workflows
const FALLBACK_ITEMS: WorkItem[] = [
  {
    id: "q1",
    title: "情報処理安全確保支援士試験 合格",
    category: "Qualification",
    subcategory: "国家資格 / 登録準備中",
    date: "2025.04",
    description: "サイバーセキュリティ分野の代表的な国家資格。セキュリティポリシーの策定からセキュアなシステム構築、インシデントハンドリングに必要な実践的知識を有していることを証明します。",
    link: "https://www.ipa.go.jp/shiken/kubun/sc.html"
  },
  {
    id: "q2",
    title: "応用情報技術者",
    category: "Qualification",
    subcategory: "国家資格",
    date: "2024.10",
    description: "高度IT人材として必要な戦略立案、システムアーキテクチャ設計、データベース、ネットワーク構築等の幅広い知識と応用力を証明する資格です。",
    link: "https://www.ipa.go.jp/shiken/kubun/ap.html"
  },
  {
    id: "q3",
    title: "CompTIA Security+",
    category: "Qualification",
    subcategory: "グローバル・セキュリティ資格",
    date: "2024.03",
    description: "セキュリティ実務知識を証明するグローバル認定。システムやネットワークの脆弱性評価、アクセス制御の実裝、リスク管理プロセス等を広くカバーしています。",
    link: "https://www.comptia.jp/certifications/security/"
  },
  {
    id: "c1",
    title: "情報系研究室でのセキュリティ研究活動",
    category: "Career",
    subcategory: "大学教育 / 学術研究",
    date: "2023.04 — 現在",
    description: "情報科学科の研究室にて、Webアプリケーションの自動脆弱性スキャニングツールの研究開発に従事。OWASP Top 10に基づく検証プロセスをプログラム化しています。",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDel_u4CZwytJYLCuYlzVLqwaTgqgt_towmWNDd-n01szAM7jBf-XkjwLy2tnqPLLHVP4IJaaoRDHHTo0dFALDeWejg7K55-OAGepWhciCiOe80ONyKdIPnQp_YaIHfXWVLTHfdnDVxUOzjFtJLiyEGg_JN79kJp6M4QhbqAVp0LgE3pvRJwr3eoVfwfymx4r9dYtNyhUhT6Md8RNpy06j22psHyHcfW_EboDUXzCtXO6RpZXWSBrT517H4nNumTufdIBz5V-bp3svC"
  },
  {
    id: "c2",
    title: "セキュリティサービス企業での実務インターン",
    category: "Career",
    subcategory: "実務インターンシップ",
    date: "2024.08 — 2024.09",
    description: "Web脆弱性診断を行うチームに帯同。手動スキャンおよび診断ツールによる検出結果の分類、診断レポートのドラフト作成等の実務アシスタントを経験しました。",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnKl4nbfCNkcxR6U29hgx4turXMfKj1nQV5MZ3l0BJL5nVKQy_gsyJFtkfhd-AWZ2q0YIJe86z4hRW5FzKqvK5yDH8xATZi0Iqwis15gwMHmqv9jCDD14SmaG2qIqqZisH1RoOqbJFinAljGwFWDBPEAd0VHNrfohMD7Kk9BtXSYT4vcEjP2jLllh9WTDp4nPAwuGenky6kKamEFc9NKhOkR8MqTKZbEYAR1qPY68SJ-t6YhEXpdKD9w38HFPRwhTwMTaDgDr8f8Yd"
  },
  {
    id: "w1",
    title: "01. 現状分析・リスクアセスメント",
    category: "Workflow",
    subcategory: "診断・調査フェーズ",
    date: "Phase 01",
    description: "お客様のIT資産（ネットワーク、サーバー、Webシステム）を棚卸し、ツールおよび手動テストによって潜在するセキュリティホールや設定ミスを可視化します。"
  },
  {
    id: "w2",
    title: "02. ポリシー策定・防御設計",
    category: "Workflow",
    subcategory: "コンサルティングフェーズ",
    date: "Phase 02",
    description: "業務プロセスを損なわずにリスクを最小化する「セキュリティポリシー」およびルール設計を支援します。ISMSなどの各種規格の準拠支援も対応します。"
  },
  {
    id: "w3",
    title: "03. 対策実装・脆弱性チェック",
    category: "Workflow",
    subcategory: "実装・検証フェーズ",
    date: "Phase 03",
    description: "脅威度合いに応じた修正提案やセキュリティソリューション（WAF、認証強化など）の導入、修正完了後の再スキャン試験による防御力評価を実施します。"
  },
  {
    id: "w4",
    title: "04. 継続監視・セキュリティ教育",
    category: "Workflow",
    subcategory: "マネジメントフェーズ",
    date: "Phase 04",
    description: "インシデントへの初動対応マニュアルの作成、ログ分析監視プロセスの構築、および組織員向けのサイバーセキュリティトレーニングを実施し継続安全を確保します。"
  }
];

export async function fetchCMSWorks(): Promise<WorkItem[]> {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (
    !serviceDomain || 
    !apiKey || 
    serviceDomain === "your-service-domain" || 
    apiKey === "your-api-key"
  ) {
    console.warn("microCMS credentials not configured. Falling back to default mock data.");
    return FALLBACK_ITEMS;
  }

  const endpoint = `https://${serviceDomain}.microcms.io/api/v1/works?limit=100`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        "X-MICROCMS-API-KEY": apiKey,
      },
      next: { revalidate: 60 }, // Revalidate cache every 60 seconds
    });

    if (!res.ok) {
      console.error(`microCMS request failed with status: ${res.status}. Falling back to default mock data.`);
      return FALLBACK_ITEMS;
    }

    const data: CMSResponse = await res.json();
    return data.contents.map((item) => {
      let imageUrl = "";
      if (typeof item.image === "object" && item.image !== null) {
        imageUrl = item.image.url;
      } else if (typeof item.image === "string") {
        imageUrl = item.image;
      }

      // Handle category (extract from array if microCMS Select field returns it as an array)
      let finalCategory: any = "others";
      if (Array.isArray(item.category)) {
        finalCategory = item.category[0] || "others";
      } else if (typeof item.category === "string") {
        finalCategory = item.category;
      }

      return {
        id: item.id,
        title: item.title,
        category: finalCategory,
        subcategory: item.subcategory,
        date: item.date,
        description: item.description,
        image: imageUrl || undefined,
        link: item.link || "#",
      };
    });
  } catch (error) {
    console.error("Failed to fetch works from microCMS. Falling back to default mock data.", error);
    return FALLBACK_ITEMS;
  }
}
