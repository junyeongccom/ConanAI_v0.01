# app/configs/training_config.py

from transformers import TrainingArguments

# TrainingArguments 설정
TRAINING_ARGS = TrainingArguments(
    output_dir                  = None, # model_config에서 설정될 예정
    overwrite_output_dir        = True,
    num_train_epochs            = 10,
    per_device_train_batch_size = 1,
    gradient_accumulation_steps = 4,
    learning_rate               = 2e-5,
    weight_decay                = 0.01,
    warmup_ratio                = 0.1,
    fp16                        = True,
    gradient_checkpointing      = False, # True 설정 시 메모리는 절약되나 속도 저하
    logging_steps               = 20,
    save_strategy               = "epoch",
    save_total_limit            = 2,
    optim                       = "adamw_torch",
    lr_scheduler_type           = "cosine",
    report_to                   = "none",
)