import { allContent } from "./opinion.js";

export const commentsAndColumns = Array.isArray(allContent?.commentAndColumns)
  ? allContent.commentAndColumns
  : [];

export default commentsAndColumns;
