import api from "../api/kyClient";
import { type PerformanceData } from "../validations/performanceSchema";

export function usePerformancePost() {
    const postPerformance = async (data: PerformanceData) => {
        const formData = new FormData();
        formData.append("codigo", data.codigo);
        formData.append("unidad", data.unidad);
        formData.append("descripcion", data.descripcion);
        formData.append("categoria", data.categoria);
        formData.append("recursos", JSON.stringify(data.recursos));
        await api.post("rendimientos", { body: formData }).json();
    };

    return { postPerformance };
}
