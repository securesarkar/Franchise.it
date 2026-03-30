const AppBackground = () => {
  return (
    <>
      {/* Main gradient base */}
      <div className="fixed inset-0 -z-10 bg-[#0b0f2a]" />

      {/* Ambient glow (same as signup) */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(circle, rgba(212,168,58,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Optional subtle grid overlay (kept minimal, not heavy canvas) */}
      <div className="fixed inset-0 -z-10 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:60px_60px]" />
    </>
  );
};

export default AppBackground;