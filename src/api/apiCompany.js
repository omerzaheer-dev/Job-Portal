import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function getCompanies(token) {
    const supabase = await supabaseClient(token)
    let { data, error } = await supabase
        .from("companies")
        .select("*");
    if (error) {
        console.log("Error while fetching companies", error)
        return null;
    }
    return data;
}
export async function addCompany(token, _, companyData) {
    const supabase = await supabaseClient(token)
    let logo_url;
    if (companyData.logo !== undefined) {
        const random = Math.floor(Math.random() * 90000)
        const filename = `logo-${random}-${companyData.name}`;
        const { error: storageError } = await supabase.storage.from("logos").upload(filename, companyData.logo)
        if (storageError) {
            console.log("Error uplaoding logo", storageError)
            return null;
        }
        logo_url = `${supabaseUrl}/storage/v1/object/public/logos/${filename}`
    } else {
        logo_url = ""
    }

    let { data, error } = await supabase
        .from("companies")
        .insert([
            {
                name: companyData.name,
                logo_url
            }
        ])
        .select();
    if (error) {
        console.log("Error while fetching companies", error)
        return null;
    }
    return data;
}