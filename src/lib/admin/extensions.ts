import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import type { AnyExtension } from "@tiptap/core";

/** Shared TipTap extension set for Live Preview and lossless Body checks. */
export function bodyDialectExtensions(): AnyExtension[] {
  return [
    StarterKit,
    Table,
    TableRow,
    TableCell,
    TableHeader,
    TaskList,
    TaskItem.configure({ nested: true }),
  ];
}
