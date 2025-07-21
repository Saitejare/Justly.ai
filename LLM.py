# -*- coding: utf-8 -*-
"""
Script for fine-tuning TinyLLaMA on a custom dataset using PEFT/LoRA and HuggingFace Transformers.
"""

from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model
from datasets import load_dataset
from trl import SFTTrainer

model_name = "TinyLLaMA/TinyLLaMA-1.1B-Chat-v1.0"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

dataset = load_dataset("json", data_files=r"B:\projects\justlyai\data.json", split="train")

print("First example in dataset:", dataset[0])  # Debug: print the first example

def tokenize(example):
    msgs = example["messages"]
    user_prompt = ""
    assistant_reply = ""
    for msg in msgs:
        if msg["role"] == "user":
            user_prompt += f"User: {msg['content']}\n"
        if msg["role"] == "assistant":
            assistant_reply += f"Assistant: {msg['content']}\n"

    full_prompt = user_prompt + "Assistant:"
    full_completion = assistant_reply

    inputs = tokenizer(full_prompt, truncation=True, max_length=512, padding="max_length")
    labels = tokenizer(full_prompt + full_completion, truncation=True, max_length=512, padding="max_length")["input_ids"]

    inputs["labels"] = labels
    return inputs

tokenized_dataset = dataset.map(tokenize)

lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.1,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, lora_config)

training_args = TrainingArguments(
    output_dir="./justlyai-tinyllama",
    per_device_train_batch_size=4,
    num_train_epochs=3,
    learning_rate=2e-4,
    fp16=True,
    logging_dir="./logs",
    save_strategy="epoch",
    report_to=[],  # disables wandb
)

from transformers import Trainer, DataCollatorForLanguageModeling

trainer = Trainer(
    model=model,
    train_dataset=tokenized_dataset,
    args=training_args,
    data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False)
)

trainer.train()

def chat(query):
    prompt = f"""<s>\nUser: {query}\nAssistant:"""
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    output = model.generate(
        **inputs,
        max_new_tokens=150,
        do_sample=True,
        temperature=0.7,
        top_p=0.9,
        eos_token_id=tokenizer.eos_token_id
    )

    decoded = tokenizer.decode(output[0], skip_special_tokens=True)
    response = decoded.split("Assistant:")[-1].strip()
    print("🗨️ Answer:", response)

chat("What happens if I am accused of murder?")