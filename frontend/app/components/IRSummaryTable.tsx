interface IRSummaryTableProps {
  data: {
    investment_opinion?: {
      opinion?: string;
      target_price?: string;
      target_per?: string;
    };
    forecast?: {
      "2025F"?: {
        매출?: string;
        영업이익?: string;
      };
    };
    summary?: string;
  };
}

export default function IRSummaryTable({ data }: IRSummaryTableProps) {
  const opinion = data.investment_opinion || {};
  const forecast = data.forecast?.["2025F"] || {};

  return (
    <div className="max-w-2xl mx-auto mt-4 border rounded-lg shadow-lg p-6 bg-white">
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr className="hover:bg-gray-50">
            <th className="text-left border-b border-gray-200 p-3 font-semibold text-gray-700 bg-gray-50 w-1/3">
              투자의견
            </th>
            <td className="border-b border-gray-200 p-3 text-gray-900">
              {opinion.opinion || '-'}
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <th className="text-left border-b border-gray-200 p-3 font-semibold text-gray-700 bg-gray-50">
              목표주가
            </th>
            <td className="border-b border-gray-200 p-3 text-gray-900">
              {opinion.target_price || '-'}
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <th className="text-left border-b border-gray-200 p-3 font-semibold text-gray-700 bg-gray-50">
              타겟 PER
            </th>
            <td className="border-b border-gray-200 p-3 text-gray-900">
              {opinion.target_per || '-'}
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <th className="text-left border-b border-gray-200 p-3 font-semibold text-gray-700 bg-gray-50">
              2025F 매출
            </th>
            <td className="border-b border-gray-200 p-3 text-gray-900">
              {forecast["매출"] || '-'}
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <th className="text-left border-b border-gray-200 p-3 font-semibold text-gray-700 bg-gray-50">
              2025F 영업이익
            </th>
            <td className="border-b border-gray-200 p-3 text-gray-900">
              {forecast["영업이익"] || '-'}
            </td>
          </tr>
          <tr className="hover:bg-gray-50">
            <th className="text-left p-3 font-semibold text-gray-700 bg-gray-50 align-top">
              요약
            </th>
            <td className="p-3 text-gray-900 whitespace-pre-wrap leading-relaxed">
              {data.summary || '-'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 