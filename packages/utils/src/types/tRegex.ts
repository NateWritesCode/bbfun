import { z } from "zod";

export const ZRegexDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const ZRegexSlug = z.string().regex(/^[a-z-\d]+$/);
export const ZRegexSlugCity = z.string().regex(/^[a-z-]+$/);
