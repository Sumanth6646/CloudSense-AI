function PageTitle({ title, description }) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-slate-800">
        {title}
      </h1>

      <p className="text-slate-500 mt-2">
        {description}
      </p>
    </div>
  );
}

export default PageTitle;