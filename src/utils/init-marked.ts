import { marked, Renderer } from "marked";
import { mangle } from "marked-mangle";
import { gfmHeadingId } from "marked-gfm-heading-id";

marked.use(mangle());
marked.use(gfmHeadingId());

Renderer.prototype.paragraph = text => text;

