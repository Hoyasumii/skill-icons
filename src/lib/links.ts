import { API_URL } from '../../shared/icons';

/** Who made this fork. */
export const AUTHOR_NAME = 'Alan Reis';
export const AUTHOR_URL = 'https://github.com/Hoyasumii';

export const REPO_URL = 'https://github.com/Hoyasumii/skill-icons';
/** The original project this one is forked from. */
export const UPSTREAM_REPO = 'tandpfun/skill-icons';
export const UPSTREAM_URL = `https://github.com/${UPSTREAM_REPO}`;

export const PACKAGE_NAME = '@hoyasumii/skill-icons';
export const NPM_URL = `https://www.npmjs.com/package/${PACKAGE_NAME}`;

/** Remote MCP server, served by the Worker; a browser opening it gets the install page. */
export const MCP_URL = `${API_URL}/mcp`;
export const MCP_PAGE_PATH = '/mcp';
/** The static GitHub Pages build has no Worker, so it links to the page on the Worker deploy. */
export const MCP_PAGE_HREF = import.meta.env.BASE_URL === '/' ? MCP_PAGE_PATH : MCP_URL;
