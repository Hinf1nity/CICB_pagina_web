import api from "../api/kyClient";

export async function presignedUrlPost(data) {
    const dataTypeFile = data.type === 'application/pdf' ? 'pdf' : 'img';
    const presignedResponse = await api
        .post(`${dataTypeFile}s/${dataTypeFile}-presigned-url/`, {
            json: {
                file_name: data.name,
                content_type: data.type,
            },
        })
        .json<{ upload_url: string; pdf_id?: string; img_id?: string }>();

    const uploadRes = await fetch(presignedResponse.upload_url, {
        method: "PUT",
        body: data,
    });

    if (!uploadRes.ok) {
        throw new Error("Error subiendo PDF a S3");
    }

    return presignedResponse[`${dataTypeFile}_id`] || '';
}

export async function presignedUrlPatch(data: any, id: string, endpoint?: string) {
    const dataTypeFile = data.type === 'application/pdf' ? 'pdf' : 'img';
    if (endpoint === "delete") {
        const { ruta, tipo } = extractS3Info(data);
        const response = await api.delete(`${tipo}s/${id}/${tipo}-delete/`, {
            json: {
                ruta: ruta,
                tipo: tipo,
                content_type: "application/json",
            }
        });
        if (!response.ok) {
            throw new Error("Error eliminando PDF");
        }
        return "Archivo eliminado correctamente";
    }
    const presignedResponse = await api
        .patch(`${dataTypeFile}s/${id}/${dataTypeFile}-presigned-update/`, {
            json: {
                file_name: data.name,
                content_type: data.type,
            },
        })
        .json<{ upload_url: string }>();

    const uploadRes = await fetch(presignedResponse.upload_url, {
        method: "PUT",
        body: data,
    });

    if (!uploadRes.ok) {
        throw new Error("Error subiendo PDF a S3");
    }

    return "Archivo actualizado correctamente";
}

function extractS3Info(urlValue: string) {
    const url = new URL(urlValue);

    // 1. Obtenemos el path (sin el dominio ni los parámetros de búsqueda)
    // Resultado: "/mi-bucket/pdfs/*.pdf"
    let path = url.pathname;

    // 2. Quitamos el nombre del bucket de la ruta
    // Nota: El bucket suele ser el primer segmento después del primer "/"
    const pathSegments = path.split('/').filter(segment => segment.length > 0);

    // La "ruta" real (Key en S3) es todo lo que sigue al bucket
    const rutaS3 = pathSegments.slice(1).join('/');

    // 3. Extraemos la extensión del archivo
    const extension = rutaS3.split('.').pop();

    return {
        ruta: rutaS3,
        tipo: extension
    };
}