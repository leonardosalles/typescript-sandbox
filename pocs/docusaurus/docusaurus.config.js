import { themes as prismThemes } from "prism-react-renderer";

const config = {
  title: "Chicxulub",
  tagline: "Dinosaurs are cool",
  favicon: "img/favicon.ico",

  url: "http://localhost:3000",
  baseUrl: "/",

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.js",
          lastVersion: "current",
          versions: {
            current: {
              label: "2.0.0",
              path: "2.0.0",
            },
          },
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Chicxulub",
      logo: {
        alt: "Chicxulub Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Components",
        },
        {
          type: 'docsVersionDropdown',
          label: "Versions",
          versions: ['current', '1.0.0'],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
