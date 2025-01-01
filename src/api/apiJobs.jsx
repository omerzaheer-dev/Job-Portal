
import supabaseClient from "../utils/supabase"
export async function getJobs(token, { location, companyId, searchQuery }) {
    const supabase = await supabaseClient(token)
    let query = supabase.from("jobs").select("*,company:companies!jobs_company_id_fkey1(name,logo_url),saved:saved-jobs(id)");
    if (location) {
        query = query.eq("location", location);
    }
    if (companyId) {
        query = query.eq("company_id", companyId);
    }
    if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`)//if job title contains search query
    }
    const { data, error } = await query;
    if (error) {
        console.log("Error fetching jobs", error)
        return null;
    }
    return data;
}

export async function saveJob(token, { alreadySaved }, saveData) {
    const supabase = await supabaseClient(token)
    if (alreadySaved) {
        let { data, error: deleteError } = await supabase.from("saved-jobs")
            .delete()
            .eq("job_id", saveData.job_id);
        if (deleteError) {
            console.log("Error deleting saved jobs", deleteError)
            return null;
        }
        return data;
    }
    let { data, error: insertError } = await supabase.from("saved-jobs")
        .insert([saveData])
        .select();
    if (insertError) {
        console.log("Error inserting into saved jobs", insertError)
        return null;
    }
    return data;
}

export async function getSingleJob(token, { jobId }) {
    const supabase = await supabaseClient(token)
    let { data, error } = await supabase
        .from("jobs")
        .select("*,company:companies!jobs_company_id_fkey1(name,logo_url),applicants:applications(*)")
        .eq("id", jobId)
        .single();
    if (error) {
        console.log("Error while fetching companies", error)
        return null;
    }
    return data;
}
export async function updateHiringStatus(token, { jobId }, isOpen) {
    const supabase = await supabaseClient(token)
    let { data, error } = await supabase
        .from("jobs")
        .update({ isOpen })
        .eq("id", jobId)
        .single();
    if (error) {
        console.log("Error updating status", error)
        return null;
    }
    return data;
}
export async function addNewJob(token, _, jobData) {
    const supabase = await supabaseClient(token)
    let { data, error } = await supabase
        .from("jobs")
        .insert([jobData])
        .select()
    if (error) {
        console.log("Error addibg new job", error)
        return null;
    }
    return data;
}
export async function getSvedJobs(token) {
    const supabase = await supabaseClient(token)
    let { data, error } = await supabase
        .from("saved-jobs")
        .select("*,job:jobs(*,company:companies!jobs_company_id_fkey1(name,logo_url))")
    if (error) {
        console.log("Error selecting saved jobs", error)
        return null;
    }
    return data;
}
export async function getMyJobs(token, { recruiter_id }) {
    const supabase = await supabaseClient(token)
    let { data, error } = await supabase
        .from("jobs")
        .select("*,company:companies!jobs_company_id_fkey1(name,logo_url))")
        .eq("recruiter_id", recruiter_id)
    if (error) {
        console.log("Error selecting my jobs", error)
        return null;
    }
    return data;
}
export async function deleteJob(token, { job_id }) {
    const supabase = await supabaseClient(token)
    let { data, error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", job_id)
        .select()
    if (error) {
        console.log("Error deleting jobs", error)
        return null;
    }
    return data;
}