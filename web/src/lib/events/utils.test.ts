import type { Event } from "../../types/event";
import { test } from "node:test";
import assert from "node:assert/strict";
import { splitEvents, eventDate, eventTime, safeUrl } from "./utils";
const event = (id: string, startsAt: string, endsAt?: string): Event => ({
  _id: id,
  title: id,
  slug: id,
  startsAt,
  endsAt,
  summary: "",
  venue: "",
});
test("separa y ordena eventos, manteniendo encuentros en curso", () => {
  const events = [
    event("later", "2026-12-01T00:00:00Z"),
    event("past", "2026-10-29T00:00:00Z"),
    event("ongoing", "2026-10-30T12:00:00Z", "2026-10-30T20:00:00Z"),
    event("next", "2026-10-31T00:00:00Z"),
    event("older", "2025-01-01T00:00:00Z"),
    event("invalid", "invalid"),
  ];
  const result = splitEvents(events, new Date("2026-10-30T18:00:00Z"));
  assert.deepEqual(
    result.upcoming.map((e) => e._id),
    ["ongoing", "next", "later"],
  );
  assert.deepEqual(
    result.past.map((e) => e._id),
    ["past", "older"],
  );
  assert.equal(events[0]._id, "later");
});
test("incluye un evento que comienza exactamente ahora", () =>
  assert.equal(
    splitEvents(
      [event("now", "2026-10-30T18:00:00Z")],
      new Date("2026-10-30T18:00:00Z"),
    ).upcoming.length,
    1,
  ));
test("formatea la fecha local argentina incluso al cruzar medianoche UTC", () => {
  assert.equal(eventDate("2026-11-01T01:30:00Z"), "31 de octubre de 2026");
  assert.equal(eventTime("2026-11-01T01:30:00Z"), "22:30");
});
test("admite enlaces web y rechaza protocolos ejecutables", () => {
  assert.equal(safeUrl("javascript:alert(1)"), undefined);
  assert.equal(safeUrl("data:text/html,test"), undefined);
  assert.equal(safeUrl("https://example.org/"), "https://example.org/");
  assert.equal(safeUrl(), undefined);
});

test("excluye cancelados, fechas ambiguas y rangos inválidos", () => {
  const invalid = [
    {
      ...event("cancelled", "2027-01-01T20:00:00-03:00"),
      status: "cancelled" as const,
    },
    event("bad-start", "invalid", "2027-01-01T20:00:00Z"),
    event("bad-end", "2027-01-01T20:00:00Z", "invalid"),
    event("backwards", "2027-01-02T20:00:00Z", "2027-01-01T20:00:00Z"),
    event("ambiguous", "2027-01-01T20:00:00"),
  ];
  assert.deepEqual(splitEvents(invalid), { upcoming: [], past: [] });
});
test("ordena instantes equivalentes con offsets y clasifica límites argentinos", () => {
  const now = new Date("2026-11-01T00:00:00-03:00");
  const result = splitEvents(
    [
      event("next", "2026-11-01T03:01:00Z"),
      event("midnight", "2026-11-01T00:00:00-03:00"),
      event("previous-day", "2026-10-31T23:59:00-03:00"),
    ],
    now,
  );
  assert.deepEqual(
    result.upcoming.map((e) => e._id),
    ["midnight", "next"],
  );
  assert.equal(result.past[0]._id, "previous-day");
});
