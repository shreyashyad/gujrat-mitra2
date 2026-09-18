import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import TrendingPage from "../pages/TrendingPage.jsx";
import SavedNewsPage from "../pages/SavedNewsPage.jsx";
import BeepsPage from "../pages/BeepsPage.jsx";
import EpaperPage from "../pages/EpaperPage.jsx";
import EpaperPreviewPage from "../pages/EpaperPreviewPage.jsx";
import EpaperReaderPage from "../pages/EpaperReaderPage.jsx";
import EpaperFullscreenPage from "../pages/EpaperFullscreenPage.jsx";
import AapniAajPage from "../pages/AapniAajPage.jsx";
import GamesPage from "../pages/GamesPage.jsx";
import VideosPage from "../pages/VideosPage.jsx";
import NotFound from "../pages/NotFound.jsx";
import CharchaPatraPage from "../pages/CharchaPatra.jsx";
import CharchaPatraForm from "../components/charchapatra/CharchaPatraForm.jsx";
import CharchapatraProfileData from "../components/charchapatra/CharchapatraProfileData.jsx";
import MainGrid from "../components/layout/MainGrid.jsx";
import OpinionPage from "../pages/OpinionPage.jsx";
import OpinionAuthorProfile from "../components/opinion/OpinionAuthorProfile.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/trending/:slug" element={<TrendingPage />} />
      <Route path="/saved" element={<SavedNewsPage />} />
      <Route path="/beeps" element={<BeepsPage />} />
      <Route path="/epaper" element={<EpaperPage />} />
      <Route path="/epaper/preview/:editionId" element={<EpaperPreviewPage />} />
      <Route path="/epaper/view/:editionId" element={<EpaperReaderPage />} />
      <Route path="/epaper/fullscreen/:editionId/:page" element={<EpaperFullscreenPage />} />
      <Route path="/aapni-aaj" element={<AapniAajPage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/videos" element={<VideosPage />} />

      {/* Charcha Patra Routes */}
      <Route path="/charcha-patra" element={<CharchaPatraPage />} />
      <Route
        path="/charcha-patra/form"
        element={
          <MainGrid>
            <CharchaPatraForm />
          </MainGrid>
        }
      />
      <Route path="/charcha-patra/:id" element={<CharchaPatraPage />} />
      <Route
        path="/charcha-patra/profile/:authorSlug"
        element={
          <MainGrid>
            <CharchapatraProfileData />
          </MainGrid>
        }
      />

      <Route path="/opinion" element={<OpinionPage />} />
      <Route path="/opinion/:id" element={<OpinionPage />} />
      <Route path="/opinion/author/:authorId" element={ <MainGrid><OpinionAuthorProfile /></MainGrid>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}