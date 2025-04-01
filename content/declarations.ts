export type BlocksCategoryMetadata = {
  id: string;
  name: string;
  thumbnail: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count: string;
  hasCharts?: boolean;
};

export type BlocksMetadata = {
  id: string;
  category: string;
  name: string;
};

export const categoryIds: { [key: string]: string } = {
  FileUpload: "file-upload",
  FormLayout: "form-layout",
  Login: "login",
  Stats: "stats",
};
