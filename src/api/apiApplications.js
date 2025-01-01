import supabaseClient from "@/utils/supabase";
import { supabaseUrl } from "@/utils/supabase";
export async function applyToJobs(token, _, jobData) {
    const supabase = await supabaseClient(token)
    let resume;
    if (jobData.resume !== undefined) {
        const random = Math.floor(Math.random() * 90000)
        const filename = `resume-${random}-${jobData.candidate_id}`;
        const { error: storageError } = await supabase.storage.from("resumes").upload(filename, jobData.resume)
        if (storageError) {
            console.log("Error uplaoding resume", storageError)
            return null;
        }
        resume = `${supabaseUrl}/storage/v1/object/public/resumes/${filename}`
    } else {
        resume = ""
    }
    let { data, error } = await supabase
        .from("applications")
        .insert([{
            ...jobData[0],
            resume
        }]);
    if (error) {
        throw new Error("Error submitting Application");
    }
    return data;
}

export async function updateApplicationStatus(token, { job_id }, status) {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase.from("applications")
        .update({ status })
        .eq("job_id", job_id)
        .select()
    if (error) {
        console.log("error while updating status", error);
        return null;
    }
    return data;
}
export async function getApplications(token, { user_id }) {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase.from("applications")
        .select("*,job:jobs(title,company:companies!jobs_company_id_fkey1(name))")
        .eq("candidate_id", user_id)
    if (error) {
        console.log("error fetching applications", error);
        return null;
    }
    return data;
}