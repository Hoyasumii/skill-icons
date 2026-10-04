import { API_URL } from '../../shared/icons';

export const REPO_URL = 'https://github.com/Hoyasumii/skill-icons';

/** Remote MCP server, served by the Worker; a browser opening it gets the install page. */
export const MCP_URL = `${API_URL}/mcp`;
export const MCP_PAGE_PATH = '/mcp';
/** The static GitHub Pages build has no Worker, so it links to the page on the Worker deploy. */
export const MCP_PAGE_HREF = import.meta.env.BASE_URL === '/' ? MCP_PAGE_PATH : MCP_URL;
