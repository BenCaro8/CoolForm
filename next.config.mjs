/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currPath = "/styles/";

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, currPath)],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
        pathname: "/512/25/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/wikipedia/commons/c/ca/**",
      },
    ],
  },
  compiler: {
    relay: {
      src: '',
      language: 'typescript',
    }
  }
};

export default nextConfig;
