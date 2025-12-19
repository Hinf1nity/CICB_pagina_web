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
        .json<{ upload_url: string; pdf_id: string }>();

    const uploadRes = await fetch(presignedResponse.upload_url, {
        method: "PUT",
        body: data,
    });

    if (!uploadRes.ok) {
        throw new Error("Error subiendo PDF a S3");
    }

    return presignedResponse[`${dataTypeFile}_id`];
}