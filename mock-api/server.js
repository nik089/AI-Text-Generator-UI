import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const DUMMY_IMAGE = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80";

function generateLongContent(topic, mode) {
  return `
Introduction:
${topic} is rapidly becoming a crucial part of modern digital innovation. In today’s technology-driven world, businesses and developers rely on ${topic} to build scalable, efficient, and intelligent solutions. Understanding how ${topic} works helps organizations stay competitive and future-ready in an evolving ecosystem.

Core Concept:
The foundation of ${topic} lies in automation, optimization, and user-centric design. It allows developers to create smarter applications, improve workflow efficiency, and enhance performance across platforms. By integrating ${topic} into systems, teams can streamline operations and reduce manual complexity.

Practical Applications:
One of the most valuable aspects of ${topic} is its wide range of real-world applications. From AI dashboards and SaaS platforms to frontend applications and enterprise software, ${topic} helps deliver better user experiences. Developers often use ${topic} to implement dynamic features, intelligent UI systems, and automated content generation tools.

Key Benefits:
Adopting ${topic} offers several advantages such as improved productivity, scalability, and performance optimization. It reduces operational costs, enhances system reliability, and supports faster development cycles. Additionally, it helps businesses make data-driven decisions and improve overall digital transformation strategies.

Industry Impact:
Modern companies are increasingly investing in ${topic} to stay ahead in competitive markets. It plays a major role in shaping next-generation applications, including AI-powered tools, automation systems, and smart web platforms. As technology evolves, the relevance of ${topic} continues to grow across industries.

Conclusion:
In conclusion, ${topic} is not just a trend but a fundamental component of future digital solutions. Whether used in development, business systems, or AI-driven applications, ${topic} enables innovation, efficiency, and long-term growth. Organizations that adopt ${topic} today are more likely to succeed in the rapidly advancing technological landscape.
`;
}

app.post("/api/generate", (req, res) => {
  const { prompt, type } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required",
    });
  }

  let title = "";
  let content = "";
  let image = DUMMY_IMAGE;

  switch (type) {
    case "blog":
      title = ` Complete Guide to ${prompt}`;
      content = generateLongContent(prompt, "blog");
      break;

    case "caption":
      title = ` AI Caption for ${prompt}`;
      content = `
${prompt} is transforming the future of innovation and digital creativity.
Leverage modern technology, smart solutions, and AI-driven strategies to elevate your brand, improve engagement, and deliver high-quality experiences across digital platforms.

#AI #Innovation #Technology #DigitalGrowth
`;
      break;

    case "product":
      title = `${prompt} - Product Description`;
      content = `
Product Overview:
${prompt} is a high-quality, performance-driven solution designed to improve efficiency, scalability, and user experience in modern applications.

Key Features:
- Scalable and optimized architecture
- Modern UI/UX compatibility
- Secure and reliable performance
- Easy integration with web applications
- Future-ready and AI-friendly design

Detailed Description:
${generateLongContent(prompt + " product", "product")}

Why Choose This Product:
${prompt} stands out due to its robust technology, smart design, and adaptability for startups, enterprises, and developers looking for modern digital solutions.
`;
      break;

    default:
      title = ` AI Generated Content for ${prompt}`;
      content = `
This is a mock AI-generated response for "${prompt}".
It simulates real OpenAI-style content generation for frontend testing, UI development, and API integration without using a paid AI service.

You can use this fake API to build:
- AI text generators
- Chatbots
- Content tools
- SaaS dashboards
`;
  }

  // Simulate real AI delay (UX like OpenAI)
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        title,
        image,
        type,
        wordCount: content.split(" ").length,
        content,
      },
    });
  }, 1200);
});

// Health check route (useful for testing)
app.get("/", (req, res) => {
  res.send(" Fake AI API is running on http://localhost:5000/api/generate");
});

app.listen(5000, () => {
  console.log(" Fake AI API running at: http://localhost:5000");
});
