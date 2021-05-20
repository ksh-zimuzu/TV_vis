from pathlib import Path
import jieba
stopwords = set(line.strip() for line in open(
    "edited_baidu_stopwords.txt", encoding="utf8").readlines())
p = Path(".")
tv_dirs = (x for x in p.iterdir() if x.is_dir())
for tv_dir in tv_dirs:
    print(f"处理{tv_dir}...")
    plots = (x for x in tv_dir.iterdir() if x.name.match("plot_*.txt"))
    for plot in plots:
