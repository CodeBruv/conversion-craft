/**
 * Minimal type declarations for js-yaml.
 *
 * js-yaml ships no types of its own and @types/js-yaml is not installed. This
 * declares only the two functions the project uses, which keeps the strict
 * TypeScript project (tsconfig.node.json) happy without adding a dependency.
 *
 * If @types/js-yaml is ever installed, delete this file.
 */
declare module "js-yaml" {
  export interface LoadOptions {
    filename?: string;
    json?: boolean;
    onWarning?: (warning: Error) => void;
  }

  export interface DumpOptions {
    indent?: number;
    noArrayIndent?: boolean;
    skipInvalid?: boolean;
    flowLevel?: number;
    sortKeys?: boolean | ((a: string, b: string) => number);
    lineWidth?: number;
    noRefs?: boolean;
    noCompatMode?: boolean;
    condenseFlow?: boolean;
    quotingType?: "'" | '"';
    forceQuotes?: boolean;
  }

  export function load(input: string, options?: LoadOptions): unknown;
  export function dump(input: unknown, options?: DumpOptions): string;

  export class YAMLException extends Error {
    constructor(reason?: string, mark?: unknown);
    reason: string;
    mark: unknown;
  }

  const jsYaml: {
    load: typeof load;
    dump: typeof dump;
    YAMLException: typeof YAMLException;
  };

  export default jsYaml;
}
