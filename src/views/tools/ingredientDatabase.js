// 猫粮成分分析数据库
const ingredientDatabase = [
  {
    "keyword": "鸡肉",
    "name": "鲜鸡肉",
    "level": "good",
    "category": "meat",
    "score": 95,
    "reason": "优质动物蛋白来源，易于消化吸收，符合猫的肉食天性，是猫粮中的理想成分。"
  },
  {
    "keyword": "乳鸽肉",
    "name": "鲜乳鸽肉",
    "level": "good",
    "category": "meat",
    "score": 98,
    "reason": "优质且少见的动物蛋白来源，属于低敏肉源，营养价值高，富含多种氨基酸。"
  },
  {
    "keyword": "鸡肉粉",
    "name": "鸡肉粉",
    "level": "good",
    "category": "meat",
    "score": 85,
    "reason": "浓缩的动物蛋白来源，提供了高含量的蛋白质。虽然不如鲜肉，但仍是优质的蛋白质成分。"
  },
  {
    "keyword": "鱼粉",
    "name": "鱼粉",
    "level": "good",
    "category": "meat",
    "score": 82,
    "reason": "提供了优质蛋白质和Omega-3脂肪酸，有助于皮肤和毛发健康。明确标注鳕鱼粉是加分项。"
  },
  {
    "keyword": "鸡油",
    "name": "鸡油",
    "level": "good",
    "category": "other",
    "score": 90,
    "reason": "优质动物脂肪来源，提供猫咪必需的能量和脂肪酸，能显著增加猫粮的适口性。"
  },
  {
    "keyword": "红薯",
    "name": "红薯颗粒",
    "level": "neutral",
    "category": "grain",
    "score": 70,
    "reason": "无谷物碳水化合物来源，提供膳食纤维和能量。猫对碳水化合物需求低，少量添加可以接受。"
  },
  {
    "keyword": "木薯淀粉",
    "name": "木薯淀粉",
    "level": "warning",
    "category": "grain",
    "score": 55,
    "reason": "主要作为猫粮成型的粘合剂和填充物，营养价值低，纯淀粉可能引起血糖波动。"
  },
  {
    "keyword": "鸡蛋",
    "name": "鸡蛋",
    "level": "good",
    "category": "meat",
    "score": 100,
    "reason": "完美的蛋白质来源，被称为“全蛋白”，含有猫所需的所有必需氨基酸，营养价值极高。"
  },
  {
    "keyword": "鱼油",
    "name": "鱼油",
    "level": "good",
    "category": "other",
    "score": 95,
    "reason": "优质Omega-3脂肪酸（EPA和DHA）来源，有益于皮肤、毛发、关节和大脑健康。"
  },
  {
    "keyword": "西红柿",
    "name": "新鲜西红柿",
    "level": "neutral",
    "category": "fruit_veg",
    "score": 75,
    "reason": "提供维生素和抗氧化剂（如番茄红素），但对猫不是必需成分。"
  },
  {
    "keyword": "西兰花",
    "name": "新鲜西兰花",
    "level": "neutral",
    "category": "fruit_veg",
    "score": 78,
    "reason": "提供了维生素C、维生素K和膳食纤维，有助于消化健康。"
  },
  {
    "keyword": "欧芹",
    "name": "新鲜欧芹",
    "level": "neutral",
    "category": "fruit_veg",
    "score": 70,
    "reason": "提供少量维生素，有清新口气的作用，但对猫整体营养价值有限。"
  },
  {
    "keyword": "牛油",
    "name": "牛油",
    "level": "good",
    "category": "other",
    "score": 85,
    "reason": "动物脂肪来源，提供能量，能增加适口性，但饱和脂肪酸含量相对较高。"
  },
  {
    "keyword": "南瓜",
    "name": "新鲜南瓜",
    "level": "good",
    "category": "fruit_veg",
    "score": 85,
    "reason": "优质膳食纤维来源，有助于消化系统健康，能缓解便秘或腹泻。"
  },
  {
    "keyword": "啤酒酵母粉",
    "name": "啤酒酵母粉",
    "level": "good",
    "category": "other",
    "score": 88,
    "reason": "富含B族维生素和多种矿物质，有助于改善皮肤和毛发健康，同时能增加适口性。"
  },
  {
    "keyword": "苜蓿草",
    "name": "苜蓿草颗粒",
    "level": "neutral",
    "category": "fruit_veg",
    "score": 65,
    "reason": "提供植物蛋白和纤维，但猫对其消化利用率不高，主要起填充作用。"
  },
  {
    "keyword": "蔓越莓",
    "name": "蔓越莓粉",
    "level": "good",
    "category": "fruit_veg",
    "score": 82,
    "reason": "富含抗氧化剂，有助于维持泌尿系统健康，对预防尿路感染有一定帮助。"
  },
  {
    "keyword": "螺旋藻",
    "name": "螺旋藻粉",
    "level": "good",
    "category": "fruit_veg",
    "score": 80,
    "reason": "一种营养丰富的藻类，提供多种维生素、矿物质和抗氧化物，有助于增强免疫力。"
  },
  {
    "keyword": "车前子",
    "name": "车前子",
    "level": "good",
    "category": "fruit_veg",
    "score": 85,
    "reason": "优质的可溶性纤维来源，能促进肠道蠕动，帮助猫咪排出毛球，维持肠道健康。"
  },
  {
    "keyword": "葡萄糖胺",
    "name": "葡萄糖胺盐酸盐",
    "level": "good",
    "category": "additive",
    "score": 88,
    "reason": "常见的关节保护成分，有助于维护关节软骨健康，对老年猫和大型猫尤为有益。"
  },
  {
    "keyword": "果寡糖",
    "name": "果寡糖",
    "level": "good",
    "category": "additive",
    "score": 85,
    "reason": "一种益生元，能促进肠道有益菌（如双歧杆菌）的生长，维护肠道菌群平衡。"
  },
  {
    "keyword": "甘露寡糖",
    "name": "甘露寡糖",
    "level": "good",
    "category": "additive",
    "score": 85,
    "reason": "也是一种益生元，有助于抑制有害菌在肠道的附着，增强肠道免疫力。"
  },
  {
    "keyword": "硫酸软骨素",
    "name": "硫酸软骨素",
    "level": "good",
    "category": "additive",
    "score": 88,
    "reason": "关节保护剂，常与葡萄糖胺一同使用，能为软骨提供营养，减缓磨损。"
  },
  {
    "keyword": "氯化胆碱",
    "name": "氯化胆碱",
    "level": "good",
    "category": "additive",
    "score": 80,
    "reason": "必需的营养素，对肝脏功能和神经系统发育至关重要。"
  },
  {
    "keyword": "蛋氨酸",
    "name": "蛋氨酸铁络合物",
    "level": "good",
    "category": "additive",
    "score": 90,
    "reason": "螯合矿物质，提高了铁的生物利用率和吸收率，同时补充了必需氨基酸蛋氨酸。"
  },
  {
    "keyword": "益生菌",
    "name": "枯草芽孢杆菌",
    "level": "good",
    "category": "additive",
    "score": 90,
    "reason": "一种益生菌，有助于维持肠道菌群平衡，促进消化吸收，抑制有害菌生长。"
  },
  {
    "keyword": "丝兰",
    "name": "天然类固醇萨酒皂角苷（源自丝兰）",
    "level": "good",
    "category": "additive",
    "score": 82,
    "reason": "丝兰提取物，能有效减少粪便臭味，并具有一定的抗炎作用。"
  },
  {
    "keyword": "茶多酚",
    "name": "茶多酚",
    "level": "good",
    "category": "additive",
    "score": 80,
    "reason": "天然抗氧化剂，有助于清除自由基，延缓衰老，并有清新口气的作用。"
  },
  {
    "keyword": "迷迭香提取物",
    "name": "迷迭香提取物",
    "level": "good",
    "category": "additive",
    "score": 85,
    "reason": "天然的抗氧化剂和防腐剂，用于防止脂肪氧化变质，比人工防腐剂更安全。"
  },
  {
    "keyword": "磷酸氢钙",
    "name": "磷酸氢钙",
    "level": "good",
    "category": "additive",
    "score": 85,
    "reason": "提供必需的矿物质钙和磷，是维持猫咪骨骼和牙齿健康的重要来源，也是猫粮中常见的矿物质补充剂。"
  },
  {
    "keyword": "氯化钠",
    "name": "氯化钠",
    "level": "neutral",
    "category": "additive",
    "score": 75,
    "reason": "即食盐，提供必需的电解质钠和氯，对维持体液平衡很重要。适量添加是必要的，但过量可能对心肾造成负担。"
  },
  {
    "keyword": "维生素A",
    "name": "维生素 A 乙酸酯",
    "level": "good",
    "category": "additive",
    "score": 90,
    "reason": "猫咪必需的维生素，对维持正常视力、免疫功能和皮肤健康至关重要。这是一种稳定且易于吸收的维生素A形式。"
  },
  {
    "keyword": "维生素D",
    "name": "维生素 D3",
    "level": "good",
    "category": "additive",
    "score": 95,
    "reason": "猫咪必需的维生素，能促进钙磷吸收，对骨骼发育和健康至关重要。猫无法通过日照有效合成，必须从食物中获取。"
  },
  {
    "keyword": "生育酚",
    "name": "dl-a-生育酚",
    "level": "good",
    "category": "additive",
    "score": 90,
    "reason": "维生素E的一种形式，是重要的脂溶性抗氧化剂，有助于保护细胞免受自由基损伤，同时也作为天然防腐剂防止脂肪氧化。"
  },
  {
    "keyword": "维生素C",
    "name": "L-抗坏血酸-2-磷酸酯",
    "level": "good",
    "category": "additive",
    "score": 82,
    "reason": "一种非常稳定的维生素C。虽然健康猫咪可以自行合成维C，但补充添加有助于增强免疫力、抗应激，并作为抗氧化剂。"
  },
  {
    "keyword": "维生素B1",
    "name": "硝酸硫铵",
    "level": "good",
    "category": "additive",
    "score": 95,
    "reason": "维生素B1的来源，对神经系统健康和能量代谢至关重要。猫对其需求量高且体内无法储存，是猫粮中必须添加的营养素。"
  },
  {
    "keyword": "维生素B2",
    "name": "核黄素",
    "level": "good",
    "category": "additive",
    "score": 90,
    "reason": "即维生素B2，参与能量代谢，对皮肤、毛发和眼睛的健康非常重要，是必需的B族维生素之一。"
  },
  {
    "keyword": "维生素B6",
    "name": "盐酸吡哆醇",
    "level": "good",
    "category": "additive",
    "score": 90,
    "reason": "维生素B6的来源，在蛋白质代谢和红细胞生成中扮演关键角色，为猫咪的必需营养素。"
  },
  {
    "keyword": "维生素B12",
    "name": "氰钴胺",
    "level": "good",
    "category": "additive",
    "score": 95,
    "reason": "即维生素B12，对神经系统功能、DNA合成和血细胞形成至关重要，是猫粮中必不可少的添加剂。"
  },
  {
    "keyword": "烟酸",
    "name": "烟酸",
    "level": "good",
    "category": "additive",
    "score": 95,
    "reason": "即维生素B3，猫咪自身合成能力很低，必须从食物中获取。它在能量代谢中起着关键作用。"
  },
  {
    "keyword": "泛酸钙",
    "name": "D-泛酸钙",
    "level": "good",
    "category": "additive",
    "score": 90,
    "reason": "维生素B5的来源，参与体内几乎所有的代谢活动，是维持猫咪健康所必需的营养素。"
  },
  {
    "keyword": "生物素",
    "name": "D-生物素",
    "level": "good",
    "category": "additive",
    "score": 88,
    "reason": "即维生素B7，对维持皮肤健康和亮丽毛发有重要作用，同时参与脂肪和氨基酸的代谢。"
  },
  {
    "keyword": "叶酸",
    "name": "叶酸",
    "level": "good",
    "category": "additive",
    "score": 90,
    "reason": "即维生素B9，对于细胞生长、DNA合成和红细胞形成至关重要，是猫咪必需的营养素。"
  },
  {
    "keyword": "酵母硒",
    "name": "酵母硒",
    "level": "good",
    "category": "additive",
    "score": 92,
    "reason": "一种有机的硒来源，相比无机硒（如亚硒酸钠）生物利用率更高、更安全。硒是重要的抗氧化剂，支持免疫系统功能。"
  },
  {
    "keyword": "碘酸钾",
    "name": "碘酸钾",
    "level": "good",
    "category": "additive",
    "score": 85,
    "reason": "提供必需的微量元素碘，对合成甲状腺激素至关重要，从而调节新陈代谢。是猫粮中必需的矿物质添加。"
  },
  {
    "keyword": "枯草芽孢杆菌",
    "name": "枯草芽孢杆菌",
    "level": "good",
    "category": "additive",
    "score": 90,
    "reason": "一种有益的益生菌，能以芽孢形式存活，有效到达肠道，帮助维持肠道菌群平衡，促进消化健康，抑制有害菌。"
  },
  {
    "keyword": "凝结芽孢杆菌",
    "name": "凝结芽孢杆菌",
    "level": "good",
    "category": "additive",
    "score": 90,
    "reason": "一种耐热耐酸的益生菌，能有效改善肠道环境，有助于缓解腹泻、便秘等消化问题，增强肠道免疫力。"
  },
  {
    "keyword": "地衣芽孢杆菌",
    "name": "地衣芽孢杆菌",
    "level": "good",
    "category": "additive",
    "score": 88,
    "reason": "另一种稳定的益生菌，有助于改善营养物质的消化吸收，并与其他益生菌协同作用，共同维护肠道健康。"
  },
  {
    "keyword": "鸭肉",
    "name": "鲜鸭肉",
    "level": "good",
    "category": "meat",
    "score": 96,
    "reason": "优质的动物蛋白来源。鸭肉属于低敏肉源，对于对鸡肉等常见肉类过敏的猫咪来说是一个很好的选择。"
  },
  {
    "keyword": "鸡肝",
    "name": "鲜鸡肝",
    "level": "good",
    "category": "meat",
    "score": 98,
    "reason": "营养极其丰富的内脏，富含猫咪必需的维生素A、铁和多种B族维生素。适量添加（如此处的5%）对猫非常有益。"
  },
  {
    "keyword": "纤维素",
    "name": "纤维素",
    "level": "warning",
    "category": "other",
    "score": 50,
    "reason": "一种廉价的不可溶性纤维来源，常用于增加猫粮的纤维含量以帮助排便和控制毛球。但其本身无营养价值，属于填充剂。"
  },
  {
    "keyword": "羊奶粉",
    "name": "全脂羊奶粉",
    "level": "good",
    "category": "meat",
    "score": 85,
    "reason": "相比牛奶，羊奶的乳糖含量较低，脂肪球更小，猫咪通常更容易消化。能提供优质的蛋白质、脂肪和钙质。"
  },
  {
    "keyword": "蛋黄粉",
    "name": "蛋黄粉",
    "level": "good",
    "category": "meat",
    "score": 98,
    "reason": "极佳的营养来源，富含优质脂肪、卵磷脂、维生素A、D、E等。对猫咪的皮肤健康和毛发亮泽非常有益。"
  },
  {
    "keyword": "蓝莓",
    "name": "蓝莓干",
    "level": "neutral",
    "category": "fruit_veg",
    "score": 78,
    "reason": "富含天然抗氧化剂，有助于支持免疫系统健康。猫不是必需，但少量添加可提供额外益处。干制水果含糖量略高。"
  },
  {
    "keyword": "覆盆子",
    "name": "覆盆子干",
    "level": "neutral",
    "category": "fruit_veg",
    "score": 77,
    "reason": "与蓝莓类似，提供抗氧化物和少量纤维。对猫咪来说并非必需品，但作为天然成分少量添加是安全的。"
  },
  {
    "keyword": "菊苣根粉",
    "name": "菊苣根粉",
    "level": "good",
    "category": "fruit_veg",
    "score": 90,
    "reason": "优质的益生元来源（富含菊粉），能促进猫咪肠道内有益菌的生长，维护消化系统健康。"
  },
  {
    "keyword": "牛磺酸",
    "name": "牛磺酸",
    "level": "good",
    "category": "additive",
    "score": 100,
    "reason": "猫咪的必需氨基酸，对其心脏健康、视网膜功能和繁殖系统至关重要。所有猫粮都必须添加，是评判猫粮好坏的关键指标之一。"
  },
  {
    "keyword": "氨基酸锌络合物",
    "name": "氨基酸锌络合物",
    "level": "good",
    "category": "additive",
    "score": 95,
    "reason": "螯合锌，一种有机矿物质。相比无机锌（如硫酸锌），其生物利用率和吸收率更高，对皮肤、毛发健康和免疫系统功能至关重要。"
  },
  {
    "keyword": "氨基酸铜络合物",
    "name": "氨基酸铜络合物",
    "level": "good",
    "category": "additive",
    "score": 95,
    "reason": "螯合铜，吸收率高的有机铜源。铜是维持骨骼、神经和毛色正常所必需的微量元素。"
  },
  {
    "keyword": "氨基酸铁络合物",
    "name": "氨基酸铁络合物",
    "level": "good",
    "category": "additive",
    "score": 95,
    "reason": "螯合铁，吸收率高的有机铁源。铁是合成血红蛋白的必需元素，对于预防贫血至关重要。"
  },
  {
    "keyword": "氨基酸锰络合物",
    "name": "氨基酸锰络合物",
    "level": "good",
    "category": "additive",
    "score": 95,
    "reason": "螯合锰，吸收率高的有机锰源。锰对于骨骼发育、繁殖功能和新陈代谢有重要作用。"
  },
  {
    "keyword": "碘酸钙",
    "name": "碘酸钙",
    "level": "good",
    "category": "additive",
    "score": 85,
    "reason": "提供必需的微量元素碘，是合成甲状腺激素的关键成分，用以调节新陈代谢。是猫粮中必需的矿物质添加。"
  },
  {
    "keyword": "天然维生素E",
    "name": "天然维生素E",
    "level": "good",
    "category": "additive",
    "score": 92,
    "reason": "重要的脂溶性抗氧化剂，有助于保护细胞免受氧化损伤。同时它也是一种天然的防腐剂，用于保护猫粮中的脂肪不被氧化变质。"
  },
  {
    "keyword": "焦磷酸盐",
    "name": "焦磷酸盐",
    "level": "warning",
    "category": "additive",
    "score": 55,
    "reason": "常用作诱食剂和牙垢控制剂。本身无营养价值，过量磷摄入可能增加肾脏负担。属于功能性化学添加剂，非优质成分。"
  },
  {
    "keyword": "硫胺素",
    "name": "硫胺素",
    "level": "good",
    "category": "additive",
    "score": 98,
    "reason": "即维生素B1，是猫咪必需的B族维生素。对神经系统健康和能量代谢至关重要。猫粮加工过程会破坏天然硫胺素，因此人工添加是必须且有益的。"
  },
  {
    "keyword": "洋葱",
    "name": "洋葱",
    "level": "danger",
    "category": "fruit_veg",
    "score": 0,
    "reason": "对猫有剧毒。洋葱含有会破坏猫红细胞的化合物，可能导致致命的溶血性贫血。任何形式的洋葱（包括粉末）都应避免。"
  },
  {
    "keyword": "黄豆",
    "name": "黄豆",
    "level": "danger",
    "category": "grain",
    "score": 30,
    "reason": "廉价的植物蛋白来源，用于提升猫粮的蛋白质指标。但其氨基酸谱不适合猫，生物利用率低，且含有胰蛋白酶抑制因子等抗营养物质，容易引起猫咪消化不良、胀气和过敏。"
  }
];

export default ingredientDatabase;