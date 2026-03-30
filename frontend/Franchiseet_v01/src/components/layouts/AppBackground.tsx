import InteractiveBackground from "@/components/animations/InteractiveBackground";

const AppBackground = () => {
  return (
    <>
      {/* 🌌 Canvas Background */}
      <InteractiveBackground />

      {/* Optional overlay for depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-[1]" />
    </>
  );
};

export default AppBackground;