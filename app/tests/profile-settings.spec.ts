import { expect, test, type Page } from "@playwright/test";

const settings = (page: Page) => page.locator(".settings-page");
const profile = (page: Page) => page.locator('.taste-profile-screen[data-profile-owner="true"]');
const profilePanel = (page: Page) => profile(page).locator(".taste-profile-content");
const visitorProfile = (page: Page) => page.locator(".taste-account-profile-layer .taste-profile-screen");

test("Settings opens a profile with live saved, folder, following, and follower sections", async ({ page }) => {
  // Seed deterministic local prototype data, then load it in a fresh app document.
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("daily-culture.boards.v1", JSON.stringify({
      version: 1,
      savedPieceIds: ["death-of-socrates", "divine-comedy", "great-wave"],
      boards: [
        { id: "board-default", name: "My folder", pieceIds: ["divine-comedy"] },
        { id: "board-1", name: "Study folder", pieceIds: ["great-wave"] },
      ],
    }));
    localStorage.setItem("daily-culture-followed-people-v1", JSON.stringify(["sample-person-1", "sample-person-2"]));
  });
  await page.reload();
  const settingsButton = page.locator(".bottom-nav").getByRole("button", { name: "Settings", exact: true });
  await expect(settingsButton.locator('svg[data-icon="settings"]')).toHaveCount(1);
  await expect(settingsButton.locator(".today-saver-avatar")).toHaveCount(0);
  await settingsButton.click();

  await test.step("Settings shows Julio, live counts, and the final menu order", async () => {
    await expect(settings(page).locator("h1")).toHaveCount(1);
    await expect(settings(page).getByRole("heading", { name: "Settings", exact: true })).toHaveCount(1);
    const card = settings(page).locator(".settings-account-card");
    await expect(card).toContainText("Julio Caggiano");
    await expect(card).toContainText("3 saved artworks · 2 folders");
    await expect(card.locator(".today-saver-avatar img")).toHaveAttribute("src", "/assets/profile/julio-avatar.webp");
    const viewProfile = card.getByRole("button", { name: "View profile", exact: true });
    const shareProfile = card.getByRole("button", { name: "Share profile", exact: true });
    await expect(viewProfile).toBeVisible();
    await expect(shareProfile).toBeVisible();
    const viewBounds = await viewProfile.boundingBox();
    const shareBounds = await shareProfile.boundingBox();
    expect(Math.abs(viewBounds!.width - shareBounds!.width)).toBeLessThan(1);
    expect(Math.abs(viewBounds!.y - shareBounds!.y)).toBeLessThan(1);

    const rows = settings(page).locator(".settings-secondary-menu .settings-menu-row");
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0)).toContainText("About Taste");
    await expect(rows.nth(0)).toContainText("Version 1.2");
    await expect(rows.nth(1)).toContainText("Rate App");
    await expect(rows.nth(1).locator("svg")).toHaveCount(1); // Only the row chevron, no star.
    await expect(rows.nth(2)).toContainText("Legal");
    const arrowEdges = await rows.evaluateAll(items => items.map(item => {
      const row = item.getBoundingClientRect();
      const arrow = item.querySelector("svg")!.getBoundingClientRect();
      return { right: arrow.right, inset: row.right - arrow.right };
    }));
    for (const edge of arrowEdges) {
      expect(Math.abs(edge.right - arrowEdges[0].right)).toBeLessThan(1);
      expect(edge.inset).toBeLessThan(2);
    }
    await rows.nth(0).click();
    await expect(page.getByTestId("bottom-sheet")).toContainText("About Taste");
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("bottom-sheet")).toHaveCount(0);
  });

  await settings(page).getByRole("button", { name: "View profile", exact: true }).click();
  await expect(profile(page)).toBeVisible();
  await expect(profile(page).getByRole("heading", { name: "Julio Caggiano", exact: true })).toBeVisible();
  await expect(profile(page).getByText("@juliocaggiano", { exact: true })).toBeVisible();
  await expect(profile(page).getByRole("button", { name: "Settings", exact: true })).toHaveCount(0);
  await expect(profile(page).locator(".taste-profile-actions").getByRole("button", { name: "Share profile", exact: true })).toBeVisible();
  await expect(profile(page).locator(".taste-profile-actions [aria-pressed]")).toHaveCount(0);

  await test.step("Four profile statistics reflect local state", async () => {
    const stats = profile(page).locator(".taste-profile-stats [role=tab]");
    await expect(stats).toHaveCount(4);
    for (const [id, count, label] of [
      ["artworks", "3", "Artworks"],
      ["folders", "2", "Folders"],
      ["following", "2", "Following"],
      ["followers", "0", "Followers"],
    ]) {
      const stat = profile(page).locator(`#taste-profile-tab-${id}`);
      await expect(stat.locator("strong")).toHaveText(count);
      await expect(stat.locator("span")).toHaveText(label);
    }
    await expect(profilePanel(page).locator(".taste-profile-artwork")).toHaveCount(3);
    const artworksTab = profile(page).locator("#taste-profile-tab-artworks");
    await artworksTab.focus();
    await page.keyboard.press("ArrowRight");
    await expect(profile(page).locator("#taste-profile-tab-folders")).toBeFocused();
    await expect(profilePanel(page)).toHaveAttribute("aria-labelledby", "taste-profile-tab-folders");
    await page.keyboard.press("Home");
    await expect(artworksTab).toBeFocused();
    await expect(profilePanel(page)).toHaveAttribute("aria-labelledby", "taste-profile-tab-artworks");
  });

  await test.step("Folder selection and artwork detail retain the profile", async () => {
    await profile(page).locator("#taste-profile-tab-folders").click();
    await expect(profilePanel(page)).toHaveAttribute("aria-labelledby", "taste-profile-tab-folders");
    const myFolder = profilePanel(page).locator(".taste-profile-folder").filter({ hasText: "My folder" });
    const studyFolder = profilePanel(page).locator(".taste-profile-folder").filter({ hasText: "Study folder" });
    await expect(myFolder).toBeVisible();
    await expect(studyFolder).toBeVisible();
    await expect(profilePanel(page).locator(".taste-profile-artwork")).toHaveCount(0);
    await myFolder.click();
    await expect(profilePanel(page).getByRole("button", { name: "Open The Divine Comedy" })).toBeVisible();
    await profilePanel(page).getByRole("button", { name: "Back to folders", exact: true }).click();
    await studyFolder.click();
    await expect(profilePanel(page).locator(".taste-profile-artwork")).toHaveCount(1);
    const artwork = profilePanel(page).getByRole("button", { name: "Open The Great Wave off Kanagawa" });
    await artwork.click();
    const detail = page.locator('.today-article[data-reading-view="detail"]');
    await expect(detail.locator(".today-title-row h1")).toHaveText("The Great Wave off Kanagawa");
    await expect(detail.getByRole("button", { name: "Edit", exact: true })).toBeVisible();
    await detail.getByRole("button", { name: "Close story", exact: true }).click();
    await expect(profile(page)).toBeVisible();
    await expect(profilePanel(page).getByRole("heading", { name: "Study folder", exact: true })).toBeVisible();
    await expect(artwork).toBeFocused();
    await profilePanel(page).getByRole("button", { name: "Back to folders", exact: true }).click();
    await expect(studyFolder).toBeFocused();
  });

  await test.step("Following uses saved sample people; Followers starts empty", async () => {
    await profile(page).locator("#taste-profile-tab-following").click();
    await expect(profilePanel(page)).toContainText("Sample profiles");
    await expect(profilePanel(page).locator(".taste-profile-person")).toHaveCount(2);
    await expect(profilePanel(page)).toContainText("Mara Vale");
    await expect(profilePanel(page)).toContainText("Noah Vale");
    await profile(page).locator("#taste-profile-tab-followers").click();
    await expect(profilePanel(page)).toContainText("No followers yet.");
    await expect(profilePanel(page).locator(".taste-profile-person")).toHaveCount(0);
  });

  await profile(page).getByRole("button", { name: "Back to settings", exact: true }).click();
  await expect(settings(page)).toBeVisible();
  await expect(settings(page).getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
  await settings(page).getByRole("button", { name: "View profile", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(settings(page)).toBeVisible();
});

test("Rapid profile tab changes keep the final section and focus with either motion preference", async ({ page }) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await test.step(reducedMotion, async () => {
      await page.emulateMedia({ reducedMotion });
      await page.goto("/?profile=current-prototype-reader");
      const artworksTab = profile(page).locator("#taste-profile-tab-artworks");
      const foldersTab = profile(page).locator("#taste-profile-tab-folders");
      const followersTab = profile(page).locator("#taste-profile-tab-followers");
      await artworksTab.focus();
      // Interrupt each transition before it can finish, including wraparound.
      for (const key of ["ArrowRight", "ArrowRight", "ArrowRight", "ArrowRight", "End"]) {
        await page.keyboard.press(key);
      }
      await expect(followersTab).toBeFocused();
      await expect(followersTab).toHaveAttribute("aria-selected", "true");
      await expect(profilePanel(page)).toHaveAttribute("aria-labelledby", "taste-profile-tab-followers");
      await expect(profilePanel(page)).toContainText("No followers yet.");
      await expect(profilePanel(page).locator(".taste-profile-artwork, .taste-profile-folder, .taste-profile-person")).toHaveCount(0);

      for (const key of ["Home", "End", "Home", "ArrowRight"]) await page.keyboard.press(key);
      await expect(foldersTab).toBeFocused();
      await expect(foldersTab).toHaveAttribute("aria-selected", "true");
      await expect(profilePanel(page)).toHaveAttribute("aria-labelledby", "taste-profile-tab-folders");
      await expect(profilePanel(page).locator(".taste-profile-folder")).not.toHaveCount(0);
      await expect(profilePanel(page).getByText("No followers yet.", { exact: true })).toHaveCount(0);
      await profilePanel(page).locator(".taste-profile-folder").first().click();
      await expect(profilePanel(page).getByRole("button", { name: "Back to folders", exact: true })).toBeFocused();
    });
  }
});

type ShareMode = "success" | "unavailable" | "abort";

async function mockProfileSharing(page: Page, shareMode: ShareMode, clipboardFails = false, entry: "settings" | "profile" = "settings") {
  await page.addInitScript(({ shareMode, clipboardFails }) => {
    const calls = { shares: [] as ShareData[], copies: [] as string[] };
    (window as Window & { profileSharingCalls?: typeof calls }).profileSharingCalls = calls;
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: shareMode === "unavailable" ? undefined : async (data: ShareData) => {
        calls.shares.push(data);
        if (shareMode === "abort") throw new DOMException("Share cancelled", "AbortError");
      },
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (value: string) => {
        calls.copies.push(value);
        if (clipboardFails) throw new DOMException("Clipboard unavailable", "NotAllowedError");
      } },
    });
  }, { shareMode, clipboardFails });
  if (entry === "profile") {
    await page.goto("/?profile=current-prototype-reader&share-test=discard-me#discard-me");
    await profile(page).getByRole("button", { name: "Share profile", exact: true }).click();
  } else {
    await page.goto("/?share-test=discard-me#discard-me");
    await page.locator(".bottom-nav").getByRole("button", { name: "Settings", exact: true }).click();
    await settings(page).getByRole("button", { name: "Share profile", exact: true }).click();
  }
}

async function shareCalls(page: Page) {
  return page.evaluate(() => (window as Window & {
    profileSharingCalls?: { shares: ShareData[]; copies: string[] };
  }).profileSharingCalls!);
}

test("Share profile uses the native share API with a clean working profile route", async ({ page }) => {
  await mockProfileSharing(page, "success");
  const calls = await shareCalls(page);
  expect(calls.shares).toHaveLength(1);
  expect(calls.copies).toHaveLength(0);
  const url = new URL(calls.shares[0].url!);
  expect(url.search).toBe("?profile=current-prototype-reader");
  expect(url.hash).toBe("");
  expect(calls.shares[0].title).toContain("Julio Caggiano");
  await page.goto(url.href);
  await expect(profile(page)).toBeVisible();
  await expect(profile(page).getByRole("heading", { name: "Julio Caggiano", exact: true })).toBeVisible();
});

test("Share profile copies the clean route when native share is unavailable", async ({ page }) => {
  await mockProfileSharing(page, "unavailable");
  await expect(page.locator('.toast[data-visible="true"]')).toHaveText("Profile preview link copied");
  await expect(page.getByRole("status")).toHaveText("Profile preview link copied");
  const calls = await shareCalls(page);
  expect(calls.shares).toHaveLength(0);
  expect(calls.copies).toEqual([`${new URL(page.url()).origin}/?profile=current-prototype-reader`]);
});

test("Cancelling native share does not copy or report success", async ({ page }) => {
  await mockProfileSharing(page, "abort");
  await expect(settings(page).getByRole("button", { name: "Share profile", exact: true })).toBeEnabled();
  const calls = await shareCalls(page);
  expect(calls.shares).toHaveLength(1);
  expect(calls.copies).toHaveLength(0);
  await expect(page.getByText("Profile preview link copied", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Could not share the profile. Please try again.", { exact: true })).toHaveCount(0);
});

test("A clipboard rejection reports failure without a success message", async ({ page }) => {
  await mockProfileSharing(page, "unavailable", true);
  await expect(page.locator('.toast[data-visible="true"]')).toHaveText("Could not share the profile. Please try again.");
  await expect(page.getByRole("status")).toHaveText("Could not share the profile. Please try again.");
  await expect(page.getByText("Profile preview link copied", { exact: true })).toHaveCount(0);
  await expect(settings(page).getByRole("button", { name: "Share profile", exact: true })).toBeEnabled();
});

for (const shareMode of ["success", "unavailable"] as const) {
  test(`The owner's Profile shares with native share ${shareMode}`, async ({ page }) => {
    await mockProfileSharing(page, shareMode, false, "profile");
    await expect(profile(page)).toBeVisible();
    const calls = await shareCalls(page);
    const expectedUrl = `${new URL(page.url()).origin}/?profile=current-prototype-reader`;
    if (shareMode === "success") {
      expect(calls.shares).toEqual([{ title: "Julio Caggiano · Taste", url: expectedUrl }]);
      expect(calls.copies).toHaveLength(0);
    } else {
      expect(calls.shares).toHaveLength(0);
      expect(calls.copies).toEqual([expectedUrl]);
      await expect(page.locator('.toast[data-visible="true"]')).toHaveText("Profile preview link copied");
    }
    await expect(profile(page).getByRole("button", { name: "Share profile", exact: true })).toBeEnabled();
  });
}

test("Sample profiles keep libraries separate and sync Follow across Search and the owner's Following list", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("daily-culture.boards.v1", JSON.stringify({
      version: 1,
      savedPieceIds: ["death-of-socrates", "divine-comedy"],
      boards: [
        { id: "board-default", name: "My folder", pieceIds: ["divine-comedy"] },
        { id: "board-private", name: "Owner's private folder", pieceIds: ["death-of-socrates"], isPrivate: true },
      ],
    }));
    localStorage.setItem("daily-culture-followed-people-v1", "[]");
  });
  await page.reload();
  const accountRow = page.locator('.search-account-row[data-person-id="sample-person-1"]');
  const accountIdentity = accountRow.getByRole("button", { name: "View profile: Mara Vale", exact: true });
  const searchInput = page.locator(".discover-search input");
  const visitor = visitorProfile(page);
  const visitorPanel = visitor.locator(".taste-profile-content");
  const visitorFollow = visitor.locator(".taste-profile-actions .dc-follow-button");

  async function findMara() {
    await page.locator(".bottom-nav").getByRole("button", { name: "Search", exact: true }).click();
    await page.getByRole("radiogroup", { name: "Search filters", exact: true }).getByRole("radio", { name: "Accounts", exact: true }).click();
    await searchInput.fill("Mara");
  }

  await findMara();
  await accountIdentity.focus();
  await page.keyboard.press("Enter");
  await expect(visitor.getByRole("heading", { name: "Mara Vale", exact: true })).toBeVisible();
  await expect(visitor.getByText("@mara.vale", { exact: true })).toBeVisible();
  await expect(visitor.getByText("Sample profile", { exact: true })).toBeVisible();
  await expect(visitor.getByRole("button", { name: "Back", exact: true })).toBeFocused();
  await expect(visitor.getByRole("button", { name: "Share profile", exact: true })).toHaveCount(0);

  await test.step("The visitor has no copy of the owner's saves or folders", async () => {
    await expect(visitor.locator("#account-profile-tab-artworks strong")).toHaveText("0");
    await expect(visitorPanel).toContainText("No artworks shared yet.");
    await expect(visitorPanel.locator(".taste-profile-artwork")).toHaveCount(0);
    await visitor.locator("#account-profile-tab-folders").click();
    await expect(visitor.locator("#account-profile-tab-folders strong")).toHaveText("0");
    await expect(visitorPanel).toContainText("No folders shared yet.");
    await expect(visitorPanel.locator(".taste-profile-folder")).toHaveCount(0);
    await expect(visitor.getByText("Owner's private folder", { exact: true })).toHaveCount(0);
    await visitor.locator("#account-profile-tab-following").click();
    await expect(visitor.locator("#account-profile-tab-following strong")).toHaveText("0");
    await expect(visitorPanel).toContainText("No accounts to show yet.");
  });

  await test.step("Only the known local follower edge changes from zero to one and back", async () => {
    await expect(visitorFollow).toHaveAttribute("aria-pressed", "false");
    await expect(visitor.locator("#account-profile-tab-followers strong")).toHaveText("0");
    await visitorFollow.click();
    await expect(visitorFollow).toHaveAttribute("aria-label", "Following Mara Vale. Unfollow");
    await expect(visitor.locator("#account-profile-tab-followers strong")).toHaveText("1");
    await visitor.locator("#account-profile-tab-followers").click();
    await expect(visitorPanel.locator(".taste-profile-person")).toHaveCount(1);
    await expect(visitorPanel).toContainText("Julio Caggiano");
    await visitorFollow.click();
    await expect(visitor.locator("#account-profile-tab-followers strong")).toHaveText("0");
    await expect(visitorPanel).toContainText("No followers yet.");
    await visitorFollow.click();
    await expect(visitorFollow).toHaveAttribute("aria-pressed", "true");
  });

  await visitor.getByRole("button", { name: "Back", exact: true }).click();
  await expect(visitor).toHaveCount(0);
  await expect(accountIdentity).toBeFocused();
  await expect(searchInput).toHaveValue("Mara");
  await expect(accountRow.getByRole("button", { name: "Following Mara Vale. Unfollow", exact: true })).toHaveAttribute("aria-pressed", "true");
  await accountIdentity.click();
  await page.keyboard.press("Escape");
  await expect(visitor).toHaveCount(0);
  await expect(accountIdentity).toBeFocused();
  await expect(searchInput).toHaveValue("Mara");

  await test.step("Reload keeps the follow, and the owner's Following list opens the same profile", async () => {
    await page.reload();
    await findMara();
    await expect(accountRow.getByRole("button", { name: "Following Mara Vale. Unfollow", exact: true })).toHaveAttribute("aria-pressed", "true");
    await accountIdentity.click();
    await expect(visitorFollow).toHaveAttribute("aria-pressed", "true");
    await visitor.getByRole("button", { name: "Back", exact: true }).click();
    await page.locator(".bottom-nav").getByRole("button", { name: "Settings", exact: true }).click();
    await settings(page).getByRole("button", { name: "View profile", exact: true }).click();
    await expect(profile(page).locator("#taste-profile-tab-artworks strong")).toHaveText("2");
    await expect(profile(page).locator("#taste-profile-tab-folders strong")).toHaveText("2");
    await expect(profile(page).locator("#taste-profile-tab-following strong")).toHaveText("1");
    await expect(profile(page).locator("#taste-profile-tab-followers strong")).toHaveText("0");
    await profile(page).locator("#taste-profile-tab-following").click();
    await profilePanel(page).getByRole("button", { name: "View profile: Mara Vale", exact: true }).click();
    await expect(visitor.getByRole("heading", { name: "Mara Vale", exact: true })).toBeVisible();
    await visitorFollow.click();
    await page.keyboard.press("Escape");
    await expect(visitor).toHaveCount(0);
    await expect(profile(page).locator("#taste-profile-tab-following")).toBeFocused();
    await expect(profile(page).locator("#taste-profile-tab-following strong")).toHaveText("0");
    await expect(profile(page).locator("#taste-profile-tab-followers strong")).toHaveText("0");
    await expect(profilePanel(page)).toContainText("You aren't following anyone yet.");
  });
});
