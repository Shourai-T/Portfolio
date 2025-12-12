import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import {
  Loader2,
  Save,
  User,
  Link as LinkIcon,
  FileText,
  GraduationCap,
  Briefcase,
  Code2,
} from "lucide-react";
import { ParticleBackground } from "../../components/ParticleBackground";
import { RichTextEditor } from "../../components/admin/RichTextEditor";

type Tab =
  | "personal"
  | "social"
  | "about"
  | "education"
  | "experience"
  | "skills";

export function AboutSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Forms
  const {
    register: registerPersonal,
    control: controlPersonal,
    handleSubmit: handlePersonal,
    setValue: setPersonal,
  } = useForm();
  const {
    register: registerSocial,
    handleSubmit: handleSocial,
    setValue: setSocial,
  } = useForm();

  const [aboutContent, setAboutContent] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is no rows returned

      if (data) {
        setProfileId(data.id);
        setPersonal("full_name", data.full_name);
        setPersonal("role", data.role);
        setPersonal("short_bio", data.short_bio);

        const social = (data.social_links as any) || {};
        setSocial("github", social.github);
        setSocial("twitter", social.twitter);
        setSocial("facebook", social.facebook);
        setSocial("linkedin", social.linkedin);
        setSocial("email", social.email);
        setSocial("instagram", social.instagram);

        setAboutContent(data.about_content || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSavePersonal = async (data: any) => {
    try {
      setLoading(true);
      const updates = {
        updated_at: new Date().toISOString(),
        full_name: data.full_name,
        role: data.role,
        short_bio: data.short_bio,
      };

      if (profileId) {
        await supabase.from("profile").update(updates).eq("id", profileId);
      } else {
        const { data: newProfile } = await supabase
          .from("profile")
          .insert([updates])
          .select()
          .single();
        if (newProfile) setProfileId(newProfile.id);
      }
      toast.success("Personal info saved!");
    } catch (error) {
      console.error(error);
      toast.error("Error saving personal info");
    } finally {
      setLoading(false);
    }
  };

  const onSaveSocial = async (data: any) => {
    try {
      setLoading(true);
      const updates = {
        updated_at: new Date().toISOString(),
        social_links: data,
      };

      if (profileId) {
        await supabase.from("profile").update(updates).eq("id", profileId);
      } else {
        // Need to provide required fields for insert if profile doesn't exist
        // Fetch current form values for required fields or default
        // This is a bit tricky if only social is saved first.
        // Ideally we should enforce Personal Info first or use UPSERT with default values.
        // For now, let's assume personal info is filled or we provide placeholders if profile is new.
        const { data: newProfile } = await supabase
          .from("profile")
          .insert([
            {
              ...updates,
              full_name: "New User", // Default if not set
              role: "Developer",
              short_bio: "",
            },
          ])
          .select()
          .single();
        if (newProfile) setProfileId(newProfile.id);
      }
      toast.success("Social links saved!");
    } catch (error) {
      console.error(error);
      toast.error("Error saving social links");
    } finally {
      setLoading(false);
    }
  };

  const onSaveAbout = async () => {
    try {
      setLoading(true);
      const updates = {
        updated_at: new Date().toISOString(),
        about_content: aboutContent,
      };

      if (profileId) {
        await supabase.from("profile").update(updates).eq("id", profileId);
      } else {
        const { data: newProfile } = await supabase
          .from("profile")
          .insert([
            {
              ...updates,
              full_name: "New User",
              role: "Developer",
            },
          ])
          .select()
          .single();
        if (newProfile) setProfileId(newProfile.id);
      }
      toast.success("About content saved!");
    } catch (error) {
      console.error(error);
      toast.error("Error saving about content");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "social", label: "Social Links", icon: LinkIcon },
    { id: "about", label: "About Content", icon: FileText },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Tech Skills", icon: Code2 },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white relative py-12">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold font-serif mb-8">About Settings</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-dark-bg font-bold"
                    : "bg-white/5 text-dark-text-secondary hover:bg-white/10 hover:text-white"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 md:p-8">
            {/* PERSONAL TAB */}
            {activeTab === "personal" && (
              <form
                onSubmit={handlePersonal(onSavePersonal)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                    Full Name
                  </label>
                  <input
                    {...registerPersonal("full_name", { required: true })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="e.g. Nguyen Van A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                    Role / Position
                  </label>
                  <input
                    {...registerPersonal("role", { required: true })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                    Short Description
                  </label>
                  <Controller
                    control={controlPersonal}
                    name="short_bio"
                    render={({ field }) => (
                      <div className="prose prose-invert max-w-none">
                        <RichTextEditor
                          content={field.value || ""}
                          onChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-white text-dark-bg font-bold rounded-lg hover:bg-white/90"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}

            {/* SOCIAL TAB */}
            {activeTab === "social" && (
              <form onSubmit={handleSocial(onSaveSocial)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                      GitHub URL
                    </label>
                    <input
                      {...registerSocial("github")}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                      Twitter / X URL
                    </label>
                    <input
                      {...registerSocial("twitter")}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                      Facebook URL
                    </label>
                    <input
                      {...registerSocial("facebook")}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      {...registerSocial("linkedin")}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                      Email Address
                    </label>
                    <input
                      {...registerSocial("email")}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="example@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                      Instagram URL
                    </label>
                    <input
                      {...registerSocial("instagram")}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-white text-dark-bg font-bold rounded-lg hover:bg-white/90"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}

            {/* ABOUT CONTENT TAB */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <div className="prose prose-invert max-w-none">
                  <RichTextEditor
                    content={aboutContent}
                    onChange={setAboutContent}
                  />
                </div>
                <button
                  onClick={onSaveAbout}
                  disabled={loading}
                  className="px-6 py-2 bg-white text-dark-bg font-bold rounded-lg hover:bg-white/90"
                >
                  {loading ? "Saving..." : "Save Content"}
                </button>
              </div>
            )}

            {/* Placeholder for other tabs (will implement next) */}
            {/* EDUCATION TAB */}
            {activeTab === "education" && <EducationManager />}

            {/* EXPERIENCE TAB */}
            {activeTab === "experience" && <ExperienceManager />}

            {/* SKILLS TAB */}
            {activeTab === "skills" && <SkillsManager />}
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("educations")
      .select("*")
      .order("start_date", { ascending: false });
    if (data) setItems(data);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this?")) return;
    await supabase.from("educations").delete().eq("id", id);
    fetchItems();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await supabase.from("educations").insert([data]);
      reset();
      fetchItems();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-white">Education History</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            {...register("school", { required: true })}
            placeholder="School / University"
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          />
          <input
            {...register("major")}
            placeholder="Major / Program"
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          />
          <input
            {...register("start_date")}
            placeholder="Start Year (e.g. 2018)"
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          />
          <input
            {...register("end_date")}
            placeholder="End Year (e.g. 2022)"
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          />
        </div>
        <textarea
          {...register("description")}
          placeholder="Description (optional)"
          className="w-full bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          rows={2}
        />
        <button
          disabled={loading}
          className="px-4 py-2 bg-white text-black font-bold rounded-lg"
        >
          {loading ? "Adding..." : "Add Education"}
        </button>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div>
              <h4 className="font-bold text-white">{item.school}</h4>
              <p className="text-sm text-dark-text-secondary">
                {item.major} • {item.start_date} - {item.end_date}
              </p>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .order("start_date", { ascending: false });
    if (data) setItems(data);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this?")) return;
    await supabase.from("experiences").delete().eq("id", id);
    fetchItems();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await supabase.from("experiences").insert([data]);
      reset();
      fetchItems();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-white">Work Experience</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            {...register("company", { required: true })}
            placeholder="Company / Organization"
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          />
          <input
            {...register("position", { required: true })}
            placeholder="Position / Role"
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          />
          <input
            {...register("start_date")}
            placeholder="Start Date"
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          />
          <input
            {...register("end_date")}
            placeholder="End Date"
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          />
        </div>
        <textarea
          {...register("description")}
          placeholder="Responsibilities..."
          className="w-full bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          rows={3}
        />
        <button
          disabled={loading}
          className="px-4 py-2 bg-white text-dark-bg font-bold rounded-lg"
        >
          {loading ? "Adding..." : "Add Experience"}
        </button>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div>
              <h4 className="font-bold text-white">{item.position}</h4>
              <p className="text-sm text-primary mb-1">{item.company}</p>
              <p className="text-xs text-dark-text-secondary">
                {item.start_date} - {item.end_date}
              </p>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("technical_skills")
      .select("*")
      .order("category");
    if (data) setItems(data);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this?")) return;
    await supabase.from("technical_skills").delete().eq("id", id);
    fetchItems();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await supabase.from("technical_skills").insert([data]);
      reset();
      fetchItems();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-white">Technical Skills</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            {...register("name", { required: true })}
            placeholder="Skill Name (e.g. React)"
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          />
          <select
            {...register("category")}
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Tools">Tools</option>
            <option value="Languages">Languages</option>
            <option value="Other">Other</option>
          </select>
          <input
            {...register("proficiency")}
            type="number"
            min="0"
            max="100"
            placeholder="Proficiency (0-100)"
            className="bg-black/20 text-white px-4 py-2 rounded-lg border border-white/10"
            defaultValue="100"
          />
        </div>
        <button
          disabled={loading}
          className="px-4 py-2 bg-white text-dark-bg font-bold rounded-lg"
        >
          {loading ? "Adding..." : "Add Skill"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div>
              <h4 className="font-bold text-white">{item.name}</h4>
              <p className="text-xs text-dark-text-secondary">
                {item.category} • {item.proficiency}%
              </p>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
