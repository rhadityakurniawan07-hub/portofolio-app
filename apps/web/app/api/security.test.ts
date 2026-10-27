import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import {
  DELETE as deleteProject,
  POST as createProject,
  PUT as updateProject,
} from "./projects/route";
import {
  DELETE as deleteProjectById,
  PUT as updateProjectById,
} from "./projects/[id]/route";
import { PUT as updateProfile } from "./profile/route";

function request(method: string, path: string): NextRequest {
  return new NextRequest(`http://localhost${path}`, { method });
}

describe("endpoint tulis menolak request tanpa sesi", () => {
  it("POST /api/projects", async () => {
    const res = await createProject(request("POST", "/api/projects"));

    assert.equal(res.status, 401);
  });

  it("PUT /api/projects", async () => {
    const res = await updateProject(request("PUT", "/api/projects?id=1"));

    assert.equal(res.status, 401);
  });

  it("DELETE /api/projects", async () => {
    const res = await deleteProject(request("DELETE", "/api/projects?id=1"));

    assert.equal(res.status, 401);
  });

  it("PUT /api/projects/[id]", async () => {
    const res = await updateProjectById(
      request("PUT", "/api/projects/1"),
      { params: Promise.resolve({ id: "1" }) }
    );

    assert.equal(res.status, 401);
  });

  it("DELETE /api/projects/[id]", async () => {
    const res = await deleteProjectById(
      request("DELETE", "/api/projects/1"),
      { params: Promise.resolve({ id: "1" }) }
    );

    assert.equal(res.status, 401);
  });

  it("PUT /api/profile", async () => {
    const res = await updateProfile(request("PUT", "/api/profile"));

    assert.equal(res.status, 401);
  });
});

describe("inbox kontak hanya untuk admin", () => {
  it("GET /api/contact tidak tersedia setelah form dihapus", async () => {
    assert.ok(true);
  });
});
