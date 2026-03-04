import { test, expect } from '@playwright/test';

test('AI Command Center verification', async ({ page }) => {
  // Use VITE_VARIANT=ai to match the locked variant
  await page.goto('http://localhost:3001');

  // 1. Verify Header Branding
  const headerLabel = page.locator('.variant-label');
  await expect(headerLabel).toContainText('AI COMMAND CENTER');

  // 2. Verify Insights Panel Title
  const insightsTitle = page.locator('[data-panel="insights"] .panel-title');
  await expect(insightsTitle).toHaveText('AI Intelligence Brief');

  // 3. Verify Map Markers (OpenAI Lab)
  // OpenAI coordinates from src/config/ai-research-labs.ts: 37.7562, -122.4193
  const markerPos = await page.evaluate(() => {
    const ctx = (window as any).worldMonitorContext;
    if (!ctx.map) return null;
    // MapContainer now has a project method that delegates to MapLibre
    return ctx.map.project(37.7562, -122.4193);
  });

  expect(markerPos).not.toBeNull();

  // Hide panels to avoid interception during click
  await page.evaluate(() => {
    const grid = document.getElementById('panelsGrid');
    if (grid) grid.style.display = 'none';
    const bottomGrid = document.getElementById('mapBottomGrid');
    if (bottomGrid) bottomGrid.style.display = 'none';
  });

  // Click on the map canvas at the marker's screen coordinates
  if (markerPos) {
    await page.mouse.click(markerPos.x, markerPos.y);
  }

  // 4. Verify Research Popup Appearance
  const popup = page.locator('.map-popup');
  await expect(popup).toBeVisible();
  await expect(popup).toContainText('OPENAI');
  await expect(popup).toContainText('RECENT RESEARCH');

  // 5. Verify Research Service Fetching (arXiv items)
  // Wait for loading to finish
  const loading = popup.locator('.hotspot-gdelt-loading');
  await expect(loading).not.toBeVisible({ timeout: 10000 });

  // Verify links to research papers
  const researchLinks = popup.locator('.research-link');
  const count = await researchLinks.count();
  console.log(`Found ${count} research links in popup`);
  expect(count).toBeGreaterThan(0);
});
