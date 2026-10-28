// ... rest of the code

          {/* نافذة الإعدادات الجانبية المنبثقة (معدلة للمعاينة المباشرة) */}
          <div
            id="settings-popup"
            role="dialog"
            aria-label={t("settings")}
            aria-hidden={false}
            inert={false}
            className="absolute bottom-[6.25rem] top-[6.25rem] end-0 block w-1/2 overflow-y-auto border-s border-black/15 bg-white text-black shadow-xl transition-[transform,opacity] duration-300 dark:border-white/20 dark:bg-neutral-900 dark:text-white translate-x-0 opacity-100 z-50"
          >
            <div className="flex items-center justify-between border-b border-black/15 px-5 py-3 dark:border-white/20">
              <p className="text-xl font-semibold">{t("settings")}</p>
              <button
                type="button"
                aria-label={t("close")}
                onClick={() => setSettingsOpen(false)}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-black/10 focus-visible:bg-black/10 dark:hover:bg-white/15 dark:focus-visible:bg-white/15"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-3">
              <p className="pb-1 text-sm font-medium opacity-60">
                {t("language")}
              </p>
              {languages.map((l) => (
                <Option
                  key={l.code}
                  active={lang === l.code}
                  onClick={() => setLang(l.code)}
                >
                  {l.label}
                </Option>
              ))}
            </div>

            <div className="border-t border-black/15 px-5 py-3 dark:border-white/20">
              <p className="pb-1 text-sm font-medium opacity-60">
                {t("theme")}
              </p>
              {themes.map((m) => (
                <Option
                  key={m.value}
                  active={theme === m.value}
                  onClick={() => chooseTheme(m.value)}
                >
                  {t(m.key)}
                </Option>
              ))}
            </div>
          </div>

// ... rest of the code