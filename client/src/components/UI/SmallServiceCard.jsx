function SmallServiceCard({ title, duration, badge, price, description, tags }) {
  return (
    <div className="bg-[#1f2020] border border-[#53443c] hover:border-[#ffb68c] transition-colors group">
      <div className="p-8">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-2xl font-semibold text-[#e4e2e1] group-hover:text-[#ffb68c] transition-colors">
              {title}
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#a08d83] text-xs">⏱</span>

              <span className="text-[#a08d83] text-[10px] tracking-[0.1em]">{duration}</span>

              {badge && (
                <>
                  <span className="text-[#a08d83] text-[10px]">·</span>

                  <span className="text-[#a08d83] text-[10px] tracking-[0.1em]">{badge}</span>
                </>
              )}
            </div>
          </div>

          <span className="text-2xl font-bold text-[#ffb68c]">{price}</span>
        </div>

        <p className="text-[#d8c2b7] leading-relaxed mb-6">{description}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-[#53443c] px-3 py-1 text-[10px] tracking-[0.1em] text-[#a08d83]"
            >
              {tag}
            </span>
          ))}
        </div>

        <button className="block w-full text-center border border-[#53443c] py-3 text-xs tracking-[0.1em] hover:bg-[#ffb68c] hover:text-[#532200] hover:border-[#ffb68c] transition-all">
          BOOK THIS SERVICE
        </button>
      </div>
    </div>
  );
}

export default SmallServiceCard;
