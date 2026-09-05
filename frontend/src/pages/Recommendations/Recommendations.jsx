import Layout from "../../components/layout/Layout";
import Recommendations from "../../components/recommendations/Recommendations";

function RecommendationsPage() {
  return (
    <Layout>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          AI Recommendations
        </h1>

        <p className="mt-2 text-slate-500">
          Review AI-generated opportunities to optimize your cloud
          spending and reduce unnecessary costs.
        </p>
      </div>

      {/* Recommendations */}
      <Recommendations />

    </Layout>
  );
}

export default RecommendationsPage;